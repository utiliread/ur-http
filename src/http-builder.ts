import { Fetch, Http } from './http';
import { modelBind, serialize } from 'ur-json';

import { HttpBuilderOfT } from './http-builder-of-t';
import { HttpResponse } from './http-response';
import { PaginationResult } from './pagination';

export class HttpBuilder {
    message: Message;

    fetch: Fetch | undefined;
    
    constructor(message: Message, fetch: Fetch | undefined) {
        this.message = message;
        this.fetch = fetch;
    }

    static create(method: string, url: string) {
        return new HttpBuilder({
            method: method,
            url: url,
            headers: new Headers()
        }, Http.defaults.fetch);
    }

    using(fetch: Fetch) {
        this.fetch = fetch;
        return this;
    }

    protected useHandler<T>(handler: (response: Response) => Promise<T>) {
        return new HttpBuilderOfT<T>(this, handler);
    }

    async send(abortSignal?: any) {
        if (!this.fetch) {
            throw Error('fetch() is not propery configured');
        }

        if (this.message.contentType) {
            this.message.headers.set('Content-Type', this.message.contentType);
        }

        // Cast to any to allow for the signal property
        let response = await this.fetch(this.message.url, <any>{
            method: this.message.method,
            body: this.message.content,
            headers: this.message.headers,
            signal: abortSignal
        });

        return new HttpResponse(response);
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
}

export interface Message {
    method: string;
    url: string;
    headers: Headers;
    content?: any;
    contentType?: string;
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