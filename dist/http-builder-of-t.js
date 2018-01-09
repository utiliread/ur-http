import { HttpResponseOfT } from './http-response-of-t';
export class HttpBuilderOfT {
    constructor(inner, handler) {
        this.inner = inner;
        this.handler = handler;
    }
    send(abortSignal) {
        let responsePromise = this.inner.send(abortSignal).then(x => new HttpResponseOfT(x.rawResponse, this.handler));
        return asSendPromise(responsePromise, () => responsePromise.then(response => response.receive()));
    }
    transfer(abortSignal) {
        return this.send(abortSignal).thenReceive();
    }
}
function asSendPromise(responsePromise, thenReceive) {
    responsePromise.thenReceive = thenReceive;
    return responsePromise;
}
