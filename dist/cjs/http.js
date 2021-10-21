"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Http = void 0;
var http_builder_1 = require("./http-builder");
var query_string_1 = require("./query-string");
var Http = /** @class */ (function () {
    function Http(options) {
        this.options = Object.assign({}, Http.defaults, options); // Later sources' properties overwrite earlier ones.
    }
    Http.request = function (method, url, params) {
        return this.instance.request(method, url, params);
    };
    Http.head = function (url, params) {
        return this.instance.head(url, params);
    };
    Http.post = function (url, params) {
        return this.instance.post(url, params);
    };
    Http.get = function (url, params) {
        return this.instance.get(url, params);
    };
    Http.put = function (url, params) {
        return this.instance.put(url, params);
    };
    Http.patch = function (url, params) {
        return this.instance.patch(url, params);
    };
    Http.delete = function (url, params) {
        return this.instance.delete(url, params);
    };
    Http.prototype.request = function (method, url, params) {
        var message = {
            method: method,
            url: url + query_string_1.QueryString.serialize(params),
            headers: new Headers()
        };
        var options = Object.assign({}, this.options);
        return new http_builder_1.HttpBuilder(message, options);
    };
    Http.prototype.head = function (url, params) {
        return this.request('HEAD', url, params);
    };
    Http.prototype.post = function (url, params) {
        return this.request('POST', url, params);
    };
    Http.prototype.get = function (url, params) {
        return this.request('GET', url, params);
    };
    Http.prototype.put = function (url, params) {
        return this.request('PUT', url, params);
    };
    Http.prototype.patch = function (url, params) {
        return this.request('PATCH', url, params);
    };
    Http.prototype.delete = function (url, params) {
        return this.request('DELETE', url, params);
    };
    Http.defaults = {
        fetch: window.fetch ? window.fetch.bind(window) : undefined
    };
    Http.instance = new Http(Http.defaults);
    return Http;
}());
exports.Http = Http;
//# sourceMappingURL=http.js.map