var HttpBuilderOfT = /** @class */ (function () {
    function HttpBuilderOfT(inner, handler) {
        this.inner = inner;
        this.handler = handler;
    }
    HttpBuilderOfT.prototype.send = function () {
        var _this = this;
        var responsePromise = this.inner.send();
        return asSendPromise(responsePromise, function () { return responsePromise.then(function (response) { return _this.handler(response.rawResponse); }); });
    };
    HttpBuilderOfT.prototype.transfer = function () {
        return this.send().thenReceive();
    };
    return HttpBuilderOfT;
}());
export { HttpBuilderOfT };
function asSendPromise(responsePromise, thenReceive) {
    responsePromise.thenReceive = thenReceive;
    return responsePromise;
}
