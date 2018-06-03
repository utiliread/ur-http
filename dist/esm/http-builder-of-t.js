import { HttpResponseOfT } from './http-response-of-t';
var HttpBuilderOfT = /** @class */ (function () {
    function HttpBuilderOfT(inner, handler) {
        this.inner = inner;
        this.handler = handler;
    }
    HttpBuilderOfT.prototype.send = function (abortSignal) {
        var _this = this;
        var responsePromise = this.inner.send(abortSignal).then(function (x) { return new HttpResponseOfT(x.rawResponse, _this.handler); });
        return asSendPromise(responsePromise, function () { return responsePromise.then(function (response) { return response.receive(); }); });
    };
    HttpBuilderOfT.prototype.transfer = function (ensureSuccessStatusCode, abortSignal) {
        return this.send(abortSignal).then(function (response) {
            if (ensureSuccessStatusCode !== false) {
                response.ensureSuccessfulStatusCode();
            }
            return response.receive();
        });
    };
    return HttpBuilderOfT;
}());
export { HttpBuilderOfT };
function asSendPromise(responsePromise, thenReceive) {
    responsePromise.thenReceive = thenReceive;
    return responsePromise;
}
//# sourceMappingURL=http-builder-of-t.js.map