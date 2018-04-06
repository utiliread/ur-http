"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var http_builder_1 = require("./http-builder");
var http_response_of_t_1 = require("./http-response-of-t");
var HttpBuilderOfT = /** @class */ (function (_super) {
    __extends(HttpBuilderOfT, _super);
    function HttpBuilderOfT(inner, handler) {
        var _this = _super.call(this, inner.message, inner.fetch) || this;
        _this.inner = inner;
        _this.handler = handler;
        return _this;
    }
    HttpBuilderOfT.prototype.allowEmptyResponse = function () {
        var _this = this;
        return this.useHandler(function (response) {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return _this.handler(response);
        });
    };
    HttpBuilderOfT.prototype.send = function (abortSignal) {
        var _this = this;
        var responsePromise = this.inner.send(abortSignal).then(function (x) { return new http_response_of_t_1.HttpResponseOfT(x.rawResponse, _this.handler); });
        return asSendPromise(responsePromise, function () { return responsePromise.then(function (response) { return response.receive(); }); });
    };
    HttpBuilderOfT.prototype.transfer = function (abortSignal) {
        return this.send(abortSignal).thenReceive();
    };
    return HttpBuilderOfT;
}(http_builder_1.HttpBuilder));
exports.HttpBuilderOfT = HttpBuilderOfT;
function asSendPromise(responsePromise, thenReceive) {
    responsePromise.thenReceive = thenReceive;
    return responsePromise;
}
//# sourceMappingURL=http-builder-of-t.js.map