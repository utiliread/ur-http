"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Http = void 0;
var http_builder_1 = require("./http-builder");
var query_string_1 = require("./query-string");
var Http = /** @class */ (function () {
    function Http() {
    }
    Http.request = function (method, url, params) {
        return http_builder_1.HttpBuilder.create(method, url + query_string_1.QueryString.serialize(params));
    };
    Http.head = function (url, params) {
        return Http.request('HEAD', url, params);
    };
    Http.post = function (url, params) {
        return Http.request('POST', url, params);
    };
    Http.get = function (url, params) {
        return Http.request('GET', url, params);
    };
    Http.put = function (url, params) {
        return Http.request('PUT', url, params);
    };
    Http.patch = function (url, params) {
        return Http.request('PATCH', url, params);
    };
    Http.delete = function (url, params) {
        return Http.request('DELETE', url, params);
    };
    Http.defaults = {
        fetch: window.fetch ? window.fetch.bind(window) : undefined
    };
    return Http;
}());
exports.Http = Http;
//# sourceMappingURL=http.js.map