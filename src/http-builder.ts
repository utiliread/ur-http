import { deserialize, deserializeArray } from 'ur-json';

import { HttpBuilderOfT } from './http-builder-of-t';
import { HttpResponse } from './http-response';
import { isEmptyTypeCtor } from './utils';

export class HttpBuilder {
    static defaultFetch = fetch;
    
    message: {
        method: string;
        url: string;
        headers: Headers;
        content?: any;
        contentType?: string;
    };

    fetch = HttpBuilder.defaultFetch;
    
    constructor(method: string, url: string) {
        this.message = {
            method: method,
            url: url,
            headers: new Headers()
        };
    }

    using(fetch: (input: RequestInfo) => Promise<Response>) {
        this.fetch = fetch;
        return this;
    }

    private useHandler<T>(handler: (response: Response) => Promise<T>) {
        return new HttpBuilderOfT<T>(this, handler);
    }

    async send(abortSignal?: any) {
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

    withForm(content: FormData) {
        this.message.content = content;
        this.message.contentType = undefined;
        return this;
    }

    withJson(content: any) {
        this.message.content = JSON.stringify(content);
        this.message.contentType = 'application/json';
        return this;
    }

    // Modifier Extensions

    addHeader(name: string, value: string) {
        this.message.headers.append(name, value);
        return this;
    }

    // Expect Extensions

    expectJson<T>(typeCtorOrFactory?: { new (): T } | ((object: any) => T)) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            
            return response.json().then(x => {
                if (!typeCtorOrFactory) {
                    return <T>x;
                }
                const factory = isEmptyTypeCtor(typeCtorOrFactory)
                    ? (x: any) => deserialize(typeCtorOrFactory, x)
                    : typeCtorOrFactory;
                
                return factory(x);
            });
        });
    }

    expectJsonArray<T>(itemTypeCtor: { new (): T }) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            
            return response.json().then(x => deserializeArray(itemTypeCtor, x));
        });
    }
}