import { HttpResponse } from './http-response';
export declare class HttpResponseOfT<T> extends HttpResponse {
    private handler;
    constructor(rawResponse: Response, handler: (response: Response) => Promise<T>);
    receive(): Promise<T>;
}
