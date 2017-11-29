import { HttpBuilderOfT } from './http-builder-of-t';
var HttpBuilder = /** @class */ (function () {
    function HttpBuilder(url) {
        this.message = {
            url: url,
            headers: new Headers()
        };
    }
    HttpBuilder.prototype.sendContent = function (content, contentType) {
        this.message.content = content;
        this.message.contentType = contentType;
        return this;
    };
    HttpBuilder.prototype.withHandler = function (handler) {
        return new HttpBuilderOfT(this, handler);
    };
    // Send Extensions
    HttpBuilder.prototype.sendForm = function (content, contentType) {
        return this.sendContent(content, contentType);
    };
    HttpBuilder.prototype.sendJson = function (content) {
        return this.sendContent(JSON.stringify(content), 'application/json');
    };
    // Modifier Extensions
    HttpBuilder.prototype.addHeader = function (name, value) {
        this.message.headers.append(name, value);
        return this;
    };
    // Expect Extensions
    HttpBuilder.prototype.expectJson = function () {
        this.message.headers.set('Accept', 'application/json');
        return this.withHandler(function (response) { return response.json(); });
    };
    return HttpBuilder;
}());
export { HttpBuilder };
