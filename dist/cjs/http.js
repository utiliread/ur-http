"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_builder_1 = require("./http-builder");
const query_string_1 = require("./query-string");
class Http {
    static request(method, url, params) {
        return new http_builder_1.HttpBuilder(method, url + query_string_1.QueryString.serialize(params));
    }
    static head(url, params) {
        return Http.request('HEAD', url, params);
    }
    static post(url, params) {
        return Http.request('POST', url, params);
    }
    static get(url, params) {
        return Http.request('GET', url, params);
    }
    static put(url, params) {
        return Http.request('PUT', url, params);
    }
    static patch(url, params) {
        return Http.request('PATCH', url, params);
    }
    static delete(url, params) {
        return Http.request('DELETE', url, params);
    }
}
Http.defaults = {
    fetch: window.fetch ? window.fetch.bind(window) : undefined
};
exports.Http = Http;
//# sourceMappingURL=http.js.map