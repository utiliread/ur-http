import { HttpResponse } from './http-response';
export class HttpResponseOfT extends HttpResponse {
    constructor(rawResponse, handler) {
        super(rawResponse);
        this.handler = handler;
    }
    receive() {
        return this.handler(this.rawResponse);
    }
}
