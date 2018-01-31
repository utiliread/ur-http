"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_response_of_t_1 = require("./http-response-of-t");
class HttpBuilderOfT {
    constructor(inner, handler) {
        this.inner = inner;
        this.handler = handler;
    }
    send(abortSignal) {
        let responsePromise = this.inner.send(abortSignal).then(x => new http_response_of_t_1.HttpResponseOfT(x.rawResponse, this.handler));
        return asSendPromise(responsePromise, () => responsePromise.then(response => response.receive()));
    }
    transfer(abortSignal) {
        return this.send(abortSignal).thenReceive();
    }
}
exports.HttpBuilderOfT = HttpBuilderOfT;
function asSendPromise(responsePromise, thenReceive) {
    responsePromise.thenReceive = thenReceive;
    return responsePromise;
}
//# sourceMappingURL=http-builder-of-t.js.map