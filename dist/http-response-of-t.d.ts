import { HttpResponse } from './http-response';
export declare class HttpResponseOfT<T> extends HttpResponse {
    data: T;
    constructor(rawResponse: Response, data: T);
}
