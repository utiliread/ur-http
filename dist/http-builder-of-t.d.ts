import { HttpBuilder } from './http-builder';
import { HttpResponseOfT } from './http-response-of-t';
export declare class HttpBuilderOfT<T> {
    inner: HttpBuilder;
    handler: (response: Response) => Promise<T>;
    private static client;
    constructor(inner: HttpBuilder, handler: (response: Response) => Promise<T>);
    private send(method);
    post(): Promise<HttpResponseOfT<T>>;
    get(): Promise<HttpResponseOfT<T>>;
    put(): Promise<HttpResponseOfT<T>>;
    patch(): Promise<HttpResponseOfT<T>>;
    delete(): Promise<HttpResponseOfT<T>>;
}
