import { Http } from './http';
import { HttpResponse, HttpResponseOfT } from './http-response';
import { serialize } from 'ur-json';
import * as json from "./json";
import { TimeoutError } from './timeout-error';
export class HttpBuilder {
    constructor(message, fetch, timeout) {
        this.message = message;
        this.fetch = fetch;
        this.timeout = timeout;
        this._ensureSuccessStatusCode = true;
        this._onSend = [];
        this._onSent = [];
    }
    static create(method, url) {
        return new HttpBuilder({
            method: method,
            url: url,
            headers: new Headers()
        }, Http.defaults.fetch, Http.defaults.timeout);
    }
    using(fetch) {
        this.fetch = fetch;
        return this;
    }
    onSend(callback) {
        this._onSend.push(callback);
        return this;
    }
    onSent(callback) {
        this._onSent.push(callback);
        return this;
    }
    useHandler(handler) {
        return new HttpBuilderOfT(this, handler);
    }
    async send(abortSignal) {
        if (!this.fetch) {
            throw Error('fetch() is not properly configured');
        }
        if (this.message.contentType) {
            this.message.headers.set('Content-Type', this.message.contentType);
        }
        for (const callback of this._onSend) {
            await Promise.resolve(callback(this.message));
        }
        const init = {
            method: this.message.method,
            body: this.message.content,
            headers: this.message.headers,
            mode: this.message.mode
        };
        if (abortSignal || this.timeout) {
            var outerController = new AbortController();
            if (abortSignal) {
                abortSignal.addEventListener("abort", () => {
                    outerController.abort();
                });
            }
            init.signal = outerController.signal;
        }
        const fetchResponsePromise = this.fetch(this.message.url, init);
        let fetchResponse;
        if (this.timeout) {
            fetchResponse = await Promise.race([
                fetchResponsePromise,
                new Promise((_, reject) => setTimeout(() => {
                    outerController.abort();
                    reject(new TimeoutError());
                }, this.timeout))
            ]);
        }
        else {
            fetchResponse = await fetchResponsePromise;
        }
        const httpResponse = new HttpResponse(fetchResponse);
        if (this._ensureSuccessStatusCode) {
            httpResponse.ensureSuccessfulStatusCode();
        }
        for (const callback of this._onSent) {
            await Promise.resolve(callback(httpResponse));
        }
        return httpResponse;
    }
    ensureSuccessStatusCode(ensureSuccessStatusCode) {
        this._ensureSuccessStatusCode = ensureSuccessStatusCode === false ? false : true;
        return this;
    }
    hasTimeout(timeout) {
        this.timeout = timeout || undefined;
        return this;
    }
    useCors(mode) {
        this.message.mode = mode;
        return this;
    }
    // Content Extensions
    with(content, contentType) {
        this.message.content = content;
        this.message.contentType = contentType;
        return this;
    }
    withForm(content) {
        this.message.content = content;
        this.message.contentType = undefined;
        return this;
    }
    withJson(content) {
        this.message.content = serialize(content);
        this.message.contentType = 'application/json';
        return this;
    }
    withJsonPatch(operations) {
        this.message.content = serialize(operations);
        this.message.contentType = 'application/json-patch+json';
        return this;
    }
    // Modifier Extensions
    addHeader(name, value) {
        this.message.headers.append(name, value);
        return this;
    }
    // Expect Extensions
    expectString() {
        return this.useHandler(response => {
            return response.text();
        });
    }
    expectBinary() {
        return this.useHandler(response => {
            return response.arrayBuffer();
        });
    }
    expectJson(typeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then(x => json.getModelFactory(typeCtorOrFactory)(x));
        });
    }
    expectJsonArray(itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then((x) => {
                const itemFactory = json.getModelFactory(itemTypeCtorOrFactory);
                return x.map(itemFactory);
            });
        });
    }
    expectJsonNullableArray(itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then((x) => {
                const itemFactory = json.getNullableModelFactory(itemTypeCtorOrFactory);
                return x.map(itemFactory);
            });
        });
    }
    expectJsonPaginationResult(itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then((x) => {
                const itemFactory = json.getModelFactory(itemTypeCtorOrFactory);
                return {
                    meta: {
                        pageCount: x.meta.pageCount,
                        pageSize: x.meta.pageSize,
                        totalItems: x.meta.totalItems
                    },
                    data: x.data.map(itemFactory)
                };
            });
        });
    }
    expectJsonInfinitePaginationResult(itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then((x) => {
                const itemFactory = json.getModelFactory(itemTypeCtorOrFactory);
                return {
                    meta: {
                        pageSize: x.meta.pageSize,
                        continuationToken: x.meta.continuationToken
                    },
                    data: x.data.map(itemFactory)
                };
            });
        });
    }
    expectMessagePackArray(itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/x-msgpack');
        return this.useHandler(async (response) => {
            const items = [];
            const msgpack = await import("./msgpack");
            const itemFactory = msgpack.getModelFactory(itemTypeCtorOrFactory);
            for await (const item of msgpack.decodeArrayStream(response.body)) {
                items.push(itemFactory(item));
            }
            return items;
        });
    }
    streamMessagePackArray(itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/x-msgpack');
        async function* handler(response) {
            const msgpack = await import("./msgpack");
            const itemFactory = msgpack.getModelFactory(itemTypeCtorOrFactory);
            for await (const item of msgpack.decodeArrayStream(response.body)) {
                yield itemFactory(item);
            }
        }
        return this.useHandler(response => Promise.resolve(handler(response)));
    }
}
export class HttpBuilderOfT extends HttpBuilder {
    constructor(inner, handler) {
        super(inner.message, inner.fetch);
        this.inner = inner;
        this.handler = handler;
        this._onReceived = [];
    }
    onSend(callback) {
        this.inner.onSend(callback);
        return this;
    }
    onSent(callback) {
        this.inner.onSent(callback);
        return this;
    }
    ensureSuccessStatusCode(ensureSuccessStatusCode) {
        this.inner.ensureSuccessStatusCode(ensureSuccessStatusCode);
        return this;
    }
    hasTimeout(timeout) {
        this.inner.timeout = timeout;
        return this;
    }
    allowEmptyResponse() {
        if (this._onReceived.length) {
            throw new Error("onReceived() should only be called after allowEmptyResponse()");
        }
        return new HttpBuilderOfT(this.inner, response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return this.handler(response);
        });
    }
    onReceived(callback) {
        this._onReceived.push(callback);
        return this;
    }
    send(abortSignal) {
        const responsePromise = this.inner.send(abortSignal).then(x => new HttpResponseOfT(x.rawResponse, this.handler));
        return asSendPromise(responsePromise, () => responsePromise.then(response => this.handleReceive(response)));
    }
    transfer(abortSignal) {
        return this.send(abortSignal).then(response => this.handleReceive(response));
    }
    async handleReceive(response) {
        const received = await response.receive();
        for (const callback of this._onReceived) {
            await Promise.resolve(callback(received, response));
        }
        return received;
    }
}
function asSendPromise(responsePromise, thenReceive) {
    responsePromise.thenReceive = thenReceive;
    return responsePromise;
}
//# sourceMappingURL=http-builder.js.map