"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpResponse = /** @class */ (function () {
    function HttpResponse(rawResponse) {
        this.rawResponse = rawResponse;
    }
    Object.defineProperty(HttpResponse.prototype, "isInformational", {
        get: function () {
            return this.rawResponse.status >= 100 && this.rawResponse.status < 200;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpResponse.prototype, "isSuccessful", {
        get: function () {
            return this.rawResponse.status >= 200 && this.rawResponse.status < 300;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpResponse.prototype, "isRedirection", {
        get: function () {
            return this.rawResponse.status >= 300 && this.rawResponse.status < 400;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpResponse.prototype, "isClientError", {
        get: function () {
            return this.rawResponse.status >= 400 && this.rawResponse.status < 500;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpResponse.prototype, "isServerError", {
        get: function () {
            return this.rawResponse.status >= 500 && this.rawResponse.status < 600;
        },
        enumerable: true,
        configurable: true
    });
    HttpResponse.prototype.ensureSuccessfulStatusCode = function () {
        if (!this.isSuccessful) {
            throw new Error('The response was not successful');
        }
        return this;
    };
    return HttpResponse;
}());
exports.HttpResponse = HttpResponse;
//# sourceMappingURL=http-response.js.map