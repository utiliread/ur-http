import { Fetch, Http } from './http';
import { HttpResponse, HttpResponseOfT } from './http-response';
import { InfinitePaginationResult, PaginationResult } from './pagination';
import { modelBind, serialize } from 'ur-json';

import { TimeoutError } from './timeout-error';

export class HttpBuilder {
    private _ensureSuccessStatusCode = true;
    private _onSent: ((response: HttpResponse) => void | Promise<void>)[] = [];
    
    constructor(public message: Message, public fetch: Fetch | undefined, public timeout?: number) {
    }

    static create(method: string, url: string) {
        return new HttpBuilder({
            method: method,
            url: url,
            headers: new Headers()
        }, Http.defaults.fetch, Http.defaults.timeout);
    }

    using(fetch: Fetch) {
        this.fetch = fetch;
        return this;
    }

    onSent(callback: (response: HttpResponse) => void | Promise<void>) {
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

    hasTimeout(timeout: number) {
        this.timeout = timeout;
        return this;
    }

    useCors(mode: RequestMode) {
        this.message.mode = mode;
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

    expectJson<T>(typeCtorOrFactory?: { new (): T } | ((object: any) => T)) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then(x => getJsonModelFactory(typeCtorOrFactory)(x));
        });
    }

    expectJsonArray<T>(itemTypeCtorOrFactory: { new (): T } | ((item: any) => T)) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then((x: any[]) => {
                const itemFactory = getJsonModelFactory(itemTypeCtorOrFactory);

                return x.map(itemFactory);
            });
        });
    }

    expectJsonNullableArray<T>(itemTypeCtorOrFactory: { new (): T } | ((item: any) => T)) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then((x: any[]) => {
                const itemFactory = getJsonNullableModelFactory(itemTypeCtorOrFactory);

                return x.map(itemFactory);
            });
        });
    }

    expectJsonPaginationResult<T>(itemTypeCtorOrFactory: { new (): T } | ((item: any) => T)) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then((x: PaginationResult<any>) => {
                const itemFactory = getJsonModelFactory(itemTypeCtorOrFactory);
                
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

    expectJsonInfinitePaginationResult<T>(itemTypeCtorOrFactory: { new (): T } | ((item: any) => T)) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            return response.json().then((x: InfinitePaginationResult<any>) => {
                const itemFactory = getJsonModelFactory(itemTypeCtorOrFactory);
                
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
}

export class HttpBuilderOfT<T> extends HttpBuilder {
    private _onReceived: ((received: T, response: HttpResponseOfT<T>) => void | Promise<void>)[] = [];

    constructor(private inner: HttpBuilder, private handler: (response: Response) => Promise<T>) {
        super(inner.message, inner.fetch);
    }

    onSent(callback: (response: HttpResponse) => void | Promise<void>) {
        this.inner.onSent(callback);
        return this;
    }

    ensureSuccessStatusCode(ensureSuccessStatusCode?: boolean) {
        this.inner.ensureSuccessStatusCode(ensureSuccessStatusCode);
        return this;
    }

    hasTimeout(timeout: number) {
        this.inner.timeout = timeout;
        return this;
    }

    allowEmptyResponse() {
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }

            return this.handler(response);
        });
    }

    onReceived(callback: (received: T, response: HttpResponseOfT<T>) => void | Promise<void>) {
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

function getJsonNullableModelFactory<T>(typeCtorOrFactory: { new (): T } | ((object: any) => T) | undefined) {
    if (!typeCtorOrFactory) {
        return (x: any) => <T>x;
    }
    
    if (isZeroArgumentFunction(typeCtorOrFactory)) {
        // It cannot be a factory function if it takes no arguments,
        // so it must be a (zero argument) type (constructor)
        return (x: any) => {
            const bound = modelBind(typeCtorOrFactory, x);

            // The server cannot produce the undefined result
            if (bound === undefined) {
                throw Error("The model factory created a undefined result");
            }

            return bound;
        }
    }

    return typeCtorOrFactory;
}

function getJsonModelFactory<T>(typeCtorOrFactory: { new (): T } | ((object: any) => T) | undefined) {
    const factory = getJsonNullableModelFactory(typeCtorOrFactory);
    
    return (x: any) => {
        const result = factory(x);

        if (result === null) {
            throw Error("The model factory created a null result");
        }

        return result;
    };
}

function isZeroArgumentFunction<T>(typeCtor: Function): typeCtor is { new (): T } {
    return typeCtor.length === 0;
}