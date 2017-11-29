import { HttpBuilder } from './http-builder';
import { SendPromise } from './send-promise';
export declare class HttpBuilderOfT<T> {
    inner: HttpBuilder;
    handler: (response: Response) => Promise<T>;
    constructor(inner: HttpBuilder, handler: (response: Response) => Promise<T>);
    send(): SendPromise<T>;
    transfer(): Promise<T>;
}
