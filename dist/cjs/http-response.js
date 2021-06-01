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
exports.HttpResponseOfT = exports.HttpResponse = void 0;
var http_error_1 = require("./http-error");
var HttpResponse = /** @class */ (function () {
    function HttpResponse(rawResponse) {
        this.rawResponse = rawResponse;
    }
    Object.defineProperty(HttpResponse.prototype, "url", {
        get: function () {
            return this.rawResponse.url;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpResponse.prototype, "statusCode", {
        get: function () {
            return this.rawResponse.status;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpResponse.prototype, "isInformational", {
        get: function () {
            return this.statusCode >= 100 && this.statusCode < 200;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpResponse.prototype, "isSuccessful", {
        get: function () {
            return this.statusCode >= 200 && this.statusCode < 300;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpResponse.prototype, "isRedirection", {
        get: function () {
            return this.statusCode >= 300 && this.statusCode < 400;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpResponse.prototype, "isClientError", {
        get: function () {
            return this.statusCode >= 400 && this.statusCode < 500;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HttpResponse.prototype, "isServerError", {
        get: function () {
            return this.statusCode >= 500 && this.statusCode < 600;
        },
        enumerable: false,
        configurable: true
    });
    HttpResponse.prototype.ensureSuccessfulStatusCode = function () {
        if (!this.isSuccessful) {
            throw new http_error_1.HttpError(this.statusCode, this);
        }
        return this;
    };
    return HttpResponse;
}());
exports.HttpResponse = HttpResponse;
var HttpResponseOfT = /** @class */ (function (_super) {
    __extends(HttpResponseOfT, _super);
    function HttpResponseOfT(rawResponse, handler) {
        var _this = _super.call(this, rawResponse) || this;
        _this.handler = handler;
        return _this;
    }
    HttpResponseOfT.prototype.receive = function () {
        return this.handler(this.rawResponse);
    };
    return HttpResponseOfT;
}(HttpResponse));
exports.HttpResponseOfT = HttpResponseOfT;
//# sourceMappingURL=http-response.js.map