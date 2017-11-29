import { HttpBuilder } from './http-builder';
var Http = /** @class */ (function () {
    function Http() {
    }
    Http.request = function (url) {
        return new HttpBuilder(url);
    };
    return Http;
}());
export { Http };
