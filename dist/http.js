import { HttpBuilder } from './http-builder';
var Http = /** @class */ (function () {
    function Http() {
    }
    Http.request = function (method, url) {
        return new HttpBuilder(method, url);
    };
    Http.post = function (url) {
        return new HttpBuilder('POST', url);
    };
    Http.get = function (url) {
        return new HttpBuilder('GET', url);
    };
    Http.put = function (url) {
        return new HttpBuilder('PUT', url);
    };
    Http.patch = function (url) {
        return new HttpBuilder('PATCH', url);
    };
    Http.delete = function (url) {
        return new HttpBuilder('DELETE', url);
    };
    return Http;
}());
export { Http };
