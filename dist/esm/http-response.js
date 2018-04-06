var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
export { HttpResponse };
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
export { HttpResponseOfT };
//# sourceMappingURL=http-response.js.map