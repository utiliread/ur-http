import { paginationFactory } from './pagination';
import { HttpBuilderOfT } from './http-builder-of-t';
import { HttpResponse } from './http-response';
import { deserialize } from 'ur-json';
import { isEmptyTypeCtor } from './utils';
export class HttpBuilder {
    constructor(method, url) {
        this.fetch = HttpBuilder.defaultFetch;
        this.message = {
            method: method,
            url: url,
            headers: new Headers()
        };
    }
    using(fetch) {
        this.fetch = fetch;
        return this;
    }
    useHandler(handler) {
        return new HttpBuilderOfT(this, handler);
    }
    async send(abortSignal) {
        if (this.message.contentType) {
            this.message.headers.set('Content-Type', this.message.contentType);
        }
        // Cast to any to allow for the signal property
        let response = await this.fetch(this.message.url, {
            method: this.message.method,
            body: this.message.content,
            headers: this.message.headers,
            signal: abortSignal
        });
        return new HttpResponse(response);
    }
    // Content Extensions
    withForm(content) {
        this.message.content = content;
        this.message.contentType = undefined;
        return this;
    }
    withJson(content) {
        this.message.content = JSON.stringify(content);
        this.message.contentType = 'application/json';
        return this;
    }
    // Modifier Extensions
    addHeader(name, value) {
        this.message.headers.append(name, value);
        return this;
    }
    // Expect Extensions
    expectJson(typeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return response.json().then(x => {
                if (!typeCtorOrFactory) {
                    return x;
                }
                const factory = isEmptyTypeCtor(typeCtorOrFactory)
                    ? (x) => deserialize(typeCtorOrFactory, x)
                    : typeCtorOrFactory;
                return factory(x);
            });
        });
    }
    expectJsonArray(itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return response.json().then((x) => {
                const itemFactory = isEmptyTypeCtor(itemTypeCtorOrFactory)
                    ? (x) => deserialize(itemTypeCtorOrFactory, x)
                    : itemTypeCtorOrFactory;
                return x.map(itemFactory);
            });
        });
    }
    expectJsonPaginationResult(itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return response.json().then(x => paginationFactory(itemTypeCtorOrFactory, x));
        });
    }
}
HttpBuilder.defaultFetch = fetch;
