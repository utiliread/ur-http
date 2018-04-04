import { HttpBuilder } from './http-builder';
import { QueryString } from './query-string';
var Http = /** @class */ (function () {
    function Http() {
    }
    Http.request = function (method, url, params) {
        return new HttpBuilder(method, url + QueryString.serialize(params));
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
export { Http };
//# sourceMappingURL=http.js.map