import { HttpResponseOfT } from './http-response-of-t';

export interface SendPromise<T> extends Promise<HttpResponseOfT<T>> {
    thenReceive(): Promise<T>;
}