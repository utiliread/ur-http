"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ur_json_1 = require("ur-json");
const http_builder_of_t_1 = require("./http-builder-of-t");
const http_response_1 = require("./http-response");
class HttpBuilder {
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
        return new http_builder_of_t_1.HttpBuilderOfT(this, handler);
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
        return new http_response_1.HttpResponse(response);
    }
    // Content Extensions
    withForm(content) {
        this.message.content = content;
        this.message.contentType = undefined;
        return this;
    }
    withJson(content) {
        this.message.content = ur_json_1.serialize(content);
        this.message.contentType = 'application/json';
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
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return response.text();
        });
    }
    expectBinary() {
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return response.arrayBuffer();
        });
    }
    expectJson(typeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return response.json().then(x => getJsonModelFactory(typeCtorOrFactory)(x));
        });
    }
    expectJsonArray(itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return response.json().then((x) => {
                const itemFactory = getJsonModelFactory(itemTypeCtorOrFactory);
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
            return response.json().then((x) => {
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
HttpBuilder.defaultFetch = self.fetch.bind(self);
exports.HttpBuilder = HttpBuilder;
function getJsonModelFactory(typeCtorOrFactory) {
    if (!typeCtorOrFactory) {
        return (x) => x;
    }
    if (isZeroArgumentFunction(typeCtorOrFactory)) {
        // It cannot be a factory function if it takes no arguments,
        // so it must be a (zero argument) type (constructor)
        return (x) => ur_json_1.modelBind(typeCtorOrFactory, x);
    }
    return typeCtorOrFactory;
}
function isZeroArgumentFunction(typeCtor) {
    return typeCtor.length === 0;
}
//# sourceMappingURL=http-builder.js.map