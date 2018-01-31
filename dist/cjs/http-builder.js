"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagination_1 = require("./pagination");
const http_builder_of_t_1 = require("./http-builder-of-t");
const http_response_1 = require("./http-response");
const ur_json_1 = require("ur-json");
const utils_1 = require("./utils");
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
            return response.json().then(x => {
                if (!typeCtorOrFactory) {
                    return x;
                }
                const factory = utils_1.isEmptyTypeCtor(typeCtorOrFactory)
                    ? (x) => ur_json_1.deserialize(typeCtorOrFactory, x)
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
                const itemFactory = utils_1.isEmptyTypeCtor(itemTypeCtorOrFactory)
                    ? (x) => ur_json_1.deserialize(itemTypeCtorOrFactory, x)
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
            return response.json().then(x => pagination_1.paginationFactory(itemTypeCtorOrFactory, x));
        });
    }
}
HttpBuilder.defaultFetch = self.fetch.bind(self);
exports.HttpBuilder = HttpBuilder;
//# sourceMappingURL=http-builder.js.map