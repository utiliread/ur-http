import { HttpBuilder } from './http-builder';
import { SendPromise } from './send-promise';
export declare class HttpBuilderOfT<T> extends HttpBuilder {
    private inner;
    private handler;
    constructor(inner: HttpBuilder, handler: (response: Response) => Promise<T>);
    allowEmptyResponse(): HttpBuilderOfT<T | null>;
    send(abortSignal?: any): SendPromise<T>;
    transfer(abortSignal?: any): Promise<T>;
}
