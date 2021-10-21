import { HttpBuilder } from './http-builder';
import { QueryString } from './query-string';
var Http = /** @class */ (function () {
    function Http(defaults) {
        this.options = Object.assign({}, Http.defaults, defaults); // Later sources' properties overwrite earlier ones.
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
            url: url + QueryString.serialize(params),
            headers: new Headers()
        };
        var options = Object.assign({}, this.options);
        return new HttpBuilder(message, options);
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
export { Http };
//# sourceMappingURL=http.js.map