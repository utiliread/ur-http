import { HttpResponse } from './http-response';

export class HttpResponseOfT<T> extends HttpResponse {
    constructor(rawResponse: Response, public data: T) {
        super(rawResponse);
    }
}