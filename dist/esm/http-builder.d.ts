import { Fetch } from './http';
import { HttpResponse, HttpResponseOfT } from './http-response';
export declare class HttpBuilder {
    message: Message;
    fetch: Fetch | undefined;
    private _ensureSuccessStatusCode;
    private _onSent;
    constructor(message: Message, fetch: Fetch | undefined);
    static create(method: string, url: string): HttpBuilder;
    using(fetch: Fetch): this;
    onSent(callback: (response: HttpResponse) => void | Promise<void>): this;
    protected useHandler<T>(handler: (response: Response) => Promise<T>): HttpBuilderOfT<T>;
    send(abortSignal?: any): Promise<HttpResponse>;
    ensureSuccessStatusCode(ensureSuccessStatusCode?: boolean): this;
    with(content: any, contentType?: string): this;
    withForm(content: FormData): this;
    withJson(content: any): this;
    addHeader(name: string, value: string): this;
    expectString(): HttpBuilderOfT<string>;
    expectBinary(): HttpBuilderOfT<ArrayBuffer>;
    expectJson<T>(typeCtorOrFactory?: {
        new (): T;
    } | ((object: any) => T)): HttpBuilderOfT<T>;
    expectJsonArray<T>(itemTypeCtorOrFactory: {
        new (): T;
    } | ((item: any) => T)): HttpBuilderOfT<T[]>;
    expectJsonNullableArray<T>(itemTypeCtorOrFactory: {
        new (): T;
    } | ((item: any) => T)): HttpBuilderOfT<(T | null)[]>;
    expectJsonPaginationResult<T>(itemTypeCtorOrFactory: {
        new (): T;
    } | ((item: any) => T)): HttpBuilderOfT<{
        meta: {
            pageCount: number;
            pageSize: number;
            totalItems: number;
        };
        data: T[];
    }>;
    expectJsonInfinitePaginationResult<T>(itemTypeCtorOrFactory: {
        new (): T;
    } | ((item: any) => T)): HttpBuilderOfT<{
        meta: {
            pageSize: number;
            continuationToken: string | null;
        };
        data: T[];
    }>;
}
export declare class HttpBuilderOfT<T> extends HttpBuilder {
    private inner;
    private handler;
    private _onReceived;
    constructor(inner: HttpBuilder, handler: (response: Response) => Promise<T>);
    ensureSuccessStatusCode(ensureSuccessStatusCode?: boolean): this;
    allowEmptyResponse(): HttpBuilderOfT<T | null>;
    onReceived(callback: (received: T) => void | Promise<void>): this;
    send(abortSignal?: any): SendPromise<T>;
    transfer(abortSignal?: any): Promise<T>;
    private handleReceive;
}
export interface Message {
    method: string;
    url: string;
    headers: Headers;
    content?: any;
    contentType?: string;
}
export interface SendPromise<T> extends Promise<HttpResponseOfT<T>> {
    thenReceive(): Promise<T>;
}
