import { Fetch, Http } from './http';
import { HttpResponse, HttpResponseOfT } from './http-response';
import { InfinitePaginationResult, PaginationResult } from './pagination';
import { serialize } from 'ur-json';
import { Operation } from 'ur-jsonpatch';
import * as jsonFactory from "./json";

import { TimeoutError } from './timeout-error';
import { Settings } from './settings';

export class HttpBuilder {
    private _ensureSuccessStatusCode = true;
    private _onSend: ((request: Message) => void | Promise<any>)[] = [];
    private _onSent: ((response: HttpResponse) => void | Promise<any>)[] = [];

    constructor(public message: Message, public fetch: Fetch | undefined, public timeout?: number) {
    }

    static create(method: string, url: string) {
        return new HttpBuilder({
            method: method,
            url: url,
            headers: new Headers()
        }, Http.defaults.fetch, Http.defaults.timeout);
    }

    onSend(callback: (request: Message) => void | Promise<any>) {
        this._onSend.push(callback);
        return this;
    }

    onSent(callback: (response: HttpResponse) => void | Promise<any>) {
        this._onSent.push(callback);
        return this;
    }

    protected useHandler<T>(handler: (response: Response) => Promise<T>) {
        return new HttpBuilderOfT<T>(this, handler);
    }

    async send(abortSignal?: AbortSignal) {
        if (!this.fetch) {
            throw Error('fetch() is not properly configured');
        }

        if (this.message.contentType) {
            this.message.headers.set('Content-Type', this.message.contentType);
        }

        for (const callback of this._onSend) {
            await Promise.resolve(callback(this.message));
        }

        const init: RequestInit = {
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
        let fetchResponse: Response;

        if (this.timeout) {
            fetchResponse = await Promise.race([
                fetchResponsePromise,
                new Promise<Response>((_, reject) => setTimeout(() => {
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

    ensureSuccessStatusCode(ensureSuccessStatusCode?: boolean) {
        this._ensureSuccessStatusCode = ensureSuccessStatusCode === false ? false : true;

        return this;
    }

    use(settings: Settings) {
        if (settings.fetch) {
            this.useFetch(settings.fetch);
        }
        if (settings.corsMode) {
            this.useCors(settings.corsMode);
        }
        if (settings.baseUrl) {
            this.useBaseUrl(settings.baseUrl);
        }
        return this;
    }

    useFetch(fetch: Fetch) {
        this.fetch = fetch;
        return this;
    }

    useCors(mode: RequestMode) {
        this.message.mode = mode;
        return this;
    }

    useBaseUrl(baseUrl: string) {
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.substr(0, baseUrl.length - 1);
        }

        if (this.message.url.startsWith('/')) {
            this.message.url = baseUrl + this.message.url;
        }
        else {
            this.message.url = baseUrl + '/' + this.message.url;
        }
        return this;
    }

    useTimeout(timeout: number | null) {
        this.timeout = timeout || undefined;
        return this;
    }

    // Content Extensions

    with(content: any, contentType?: string) {
        this.message.content = content;
        this.message.contentType = contentType;
        return this;
    }

    withForm(content: FormData) {
        this.message.content = content;
        this.message.contentType = undefined;
        return this;
    }

    withJson(content: any) {
        this.message.content = serialize(content);
        this.message.contentType = 'application/json';
        return this;
    }

    withJsonPatch(operations: Operation[]) {
        this.message.content = serialize(operations);
        this.message.contentType = 'application/json-patch+json';
        return this;
    }

    // Modifier Extensions

    addHeader(name: string, value: string) {
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

    expectJson<T>(typeCtorOrFactory?: { new(): T } | ((object: any) => T)) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then(x => jsonFactory.getModelFactory(typeCtorOrFactory)(x));
        });
    }

    expectJsonArray<T>(itemTypeCtorOrFactory: { new(): T } | ((item: any) => T)) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then((x: any[]) => {
                const itemFactory = jsonFactory.getModelFactory(itemTypeCtorOrFactory);
                return x.map(itemFactory);
            });
        });
    }

    expectJsonNullableArray<T>(itemTypeCtorOrFactory: { new(): T } | ((item: any) => T)) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then((x: any[]) => {
                const itemFactory = jsonFactory.getNullableModelFactory(itemTypeCtorOrFactory);
                return x.map(itemFactory);
            });
        });
    }

    expectJsonPaginationResult<T>(itemTypeCtorOrFactory: { new(): T } | ((item: any) => T)) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then((x: PaginationResult<any>) => {
                const itemFactory = jsonFactory.getModelFactory(itemTypeCtorOrFactory);
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

    expectJsonInfinitePaginationResult<T>(itemTypeCtorOrFactory: { new(): T } | ((item: any) => T)) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then((x: InfinitePaginationResult<any>) => {
                const itemFactory = jsonFactory.getModelFactory(itemTypeCtorOrFactory);
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

    expectMessagePackArray<T>(itemTypeCtorOrFactory?: { new(): T } | ((item: any) => T)) {
        this.message.headers.set('Accept', 'application/x-msgpack');
        return this.useHandler(async response => {
            const items: T[] = [];
            const msgpack = await import("@msgpack/msgpack");
            const msgpackFactory = await import("./msgpack");
            const itemFactory = msgpackFactory.getModelFactory(itemTypeCtorOrFactory);
            for await (const item of msgpack.decodeArrayStream(response.body!)) {
                items.push(itemFactory(item));
            }
            return items;
        });
    }

    streamMessagePackArray<T>(itemTypeCtorOrFactory?: { new(): T } | ((item: any) => T)) {
        this.message.headers.set('Accept', 'application/x-msgpack');

        async function* handler(response: Response) {
            const msgpack = await import("@msgpack/msgpack");
            const msgpackFactory = await import("./msgpack");
            const itemFactory = msgpackFactory.getModelFactory(itemTypeCtorOrFactory);
            for await (const item of msgpack.decodeArrayStream(response.body!)) {
                yield itemFactory(item);
            }
        }
        
        return this.useHandler(response => Promise.resolve(handler(response)));
    }
}

export class HttpBuilderOfT<T> extends HttpBuilder {
    private _onReceived: ((received: T, response: HttpResponseOfT<T>) => void | Promise<any>)[] = [];

    constructor(private inner: HttpBuilder, private handler: (response: Response) => Promise<T>) {
        super(inner.message, inner.fetch);
    }

    onSend(callback: (request: Message) => void | Promise<any>) {
        this.inner.onSend(callback);
        return this;
    }

    onSent(callback: (response: HttpResponse) => void | Promise<any>) {
        this.inner.onSent(callback);
        return this;
    }

    ensureSuccessStatusCode(ensureSuccessStatusCode?: boolean) {
        this.inner.ensureSuccessStatusCode(ensureSuccessStatusCode);
        return this;
    }

    use(settings: Settings) {
        this.inner.use(settings);
        return this;
    }

    useFetch(fetch: Fetch) {
        this.inner.useFetch(fetch);
        return this;
    }

    useCors(mode: RequestMode) {
        this.inner.useCors(mode);
        return this;
    }

    useBaseUrl(baseUrl: string) {
        this.inner.useBaseUrl(baseUrl);
        return this;
    }

    useTimeout(timeout: number) {
        this.inner.useTimeout(timeout);
        return this;
    }

    allowEmptyResponse() {
        if (this._onReceived.length) {
            throw new Error("onReceived() should only be called after allowEmptyResponse()");
        }

        return new HttpBuilderOfT<T | null>(this.inner, response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }

            return this.handler(response);
        });
    }

    onReceived(callback: (received: T, response: HttpResponseOfT<T>) => void | Promise<any>) {
        this._onReceived.push(callback);
        return this;
    }

    send(abortSignal?: AbortSignal) {
        const responsePromise = this.inner.send(abortSignal).then(x => new HttpResponseOfT<T>(x.rawResponse, this.handler));

        return asSendPromise(responsePromise, () => responsePromise.then(response => this.handleReceive(response)));
    }

    transfer(abortSignal?: AbortSignal) {
        return this.send(abortSignal).then(response => this.handleReceive(response));
    }

    private async handleReceive(response: HttpResponseOfT<T>) {
        const received = await response.receive();

        for (const callback of this._onReceived) {
            await Promise.resolve(callback(received, response));
        }

        return received;
    }
}

export interface Message {
    method: string;
    url: string;
    headers: Headers;
    content?: any;
    contentType?: string;
    mode?: RequestMode;
}

export interface SendPromise<T> extends Promise<HttpResponseOfT<T>> {
    thenReceive(): Promise<T>;
}

function asSendPromise<T>(responsePromise: Promise<HttpResponse>, thenReceive: () => Promise<T>): SendPromise<T> {
    (responsePromise as SendPromise<T>).thenReceive = thenReceive;
    return responsePromise as SendPromise<T>;
}