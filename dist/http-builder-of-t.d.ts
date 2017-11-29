import { HttpBuilder } from './http-builder';
import { HttpResponseOfT } from './http-response-of-t';
export declare class HttpBuilderOfT<T> {
    inner: HttpBuilder;
    handler: (response: Response) => Promise<T>;
    constructor(inner: HttpBuilder, handler: (response: Response) => Promise<T>);
    send(): Promise<HttpResponseOfT<T>>;
}
