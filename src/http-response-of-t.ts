import { HttpResponse } from './http-response';

export class HttpResponseOfT<T> extends HttpResponse {
    constructor(rawResponse: Response, private handler: (response: Response) => Promise<T>) {
        super(rawResponse);
    }

    receive() {
        return this.handler(this.rawResponse);
    }
}