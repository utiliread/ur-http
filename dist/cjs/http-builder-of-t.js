"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_response_of_t_1 = require("./http-response-of-t");
var HttpBuilderOfT = /** @class */ (function () {
    function HttpBuilderOfT(inner, handler) {
        this.inner = inner;
        this.handler = handler;
    }
    HttpBuilderOfT.prototype.send = function (abortSignal) {
        var _this = this;
        var responsePromise = this.inner.send(abortSignal).then(function (x) { return new http_response_of_t_1.HttpResponseOfT(x.rawResponse, _this.handler); });
        return asSendPromise(responsePromise, function () { return responsePromise.then(function (response) { return response.receive(); }); });
    };
    HttpBuilderOfT.prototype.transfer = function (abortSignal, ensureSuccessStatusCode) {
        return this.send(abortSignal).then(function (response) {
            if (ensureSuccessStatusCode !== false) {
                response.ensureSuccessfulStatusCode();
            }
            return response.receive();
        });
    };
    return HttpBuilderOfT;
}());
exports.HttpBuilderOfT = HttpBuilderOfT;
function asSendPromise(responsePromise, thenReceive) {
    responsePromise.thenReceive = thenReceive;
    return responsePromise;
}
//# sourceMappingURL=http-builder-of-t.js.map