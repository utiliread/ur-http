"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
var HttpError = /** @class */ (function (_super) {
    __extends(HttpError, _super);
    function HttpError(statusCode, response) {
        if (response === void 0) { response = undefined; }
        var _this = _super.call(this, "The response was not successful: " + statusCode) || this;
        _this.statusCode = statusCode;
        _this.response = response;
        _this.name = 'HttpError';
        // Set the prototype explicitly to allow for "... instanceof HttpError",
        // see https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(_this, HttpError.prototype);
        return _this;
    }
    HttpError.prototype.details = function () {
        var _a;
        var rawResponse = (_a = this.response) === null || _a === void 0 ? void 0 : _a.rawResponse;
        if (rawResponse) {
            var contentType = rawResponse.headers.get("Content-Type");
            if (contentType && contentType.includes("application/problem+json")) {
                return rawResponse.json().then(function (details) { return details; });
            }
        }
        return Promise.reject(new Error("There are no problem details in the response"));
    };
    return HttpError;
}(Error));
exports.HttpError = HttpError;
//# sourceMappingURL=http-error.js.map