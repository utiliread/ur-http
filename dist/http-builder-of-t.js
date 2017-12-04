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
    HttpBuilderOfT.prototype.transfer = function (abortSignal) {
        return this.send(abortSignal).thenReceive();
    };
    return HttpBuilderOfT;
}());
export { HttpBuilderOfT };
function asSendPromise(responsePromise, thenReceive) {
    responsePromise.thenReceive = thenReceive;
    return responsePromise;
}
