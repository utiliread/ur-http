import { HttpResponse } from './http-response';

export interface SendPromise<T> extends Promise<HttpResponse> {
    thenReceive(): Promise<T>;
}