import { Fetch } from './http';
import { HttpResponse, HttpResponseOfT } from './http-response';
import { Operation } from 'ur-jsonpatch';
export declare class HttpBuilder {
    message: Message;
    fetch: Fetch | undefined;
    timeout?: number | undefined;
    private _ensureSuccessStatusCode;
    private _onSend;
    private _onSent;
    constructor(message: Message, fetch: Fetch | undefined, timeout?: number | undefined);
    static create(method: string, url: string): HttpBuilder;
    using(fetch: Fetch): this;
    onSend(callback: (request: Message) => void | Promise<any>): this;
    onSent(callback: (response: HttpResponse) => void | Promise<any>): this;
    protected useHandler<T>(handler: (response: Response) => Promise<T>): HttpBuilderOfT<T>;
    send(abortSignal?: AbortSignal): Promise<HttpResponse>;
    ensureSuccessStatusCode(ensureSuccessStatusCode?: boolean): this;
    hasTimeout(timeout: number | null): this;
    useCors(mode: RequestMode): this;
    with(content: any, contentType?: string): this;
    withForm(content: FormData): this;
    withJson(content: any): this;
    withJsonPatch(operations: Operation[]): this;
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
    onSend(callback: (request: Message) => void | Promise<any>): this;
    onSent(callback: (response: HttpResponse) => void | Promise<any>): this;
    ensureSuccessStatusCode(ensureSuccessStatusCode?: boolean): this;
    hasTimeout(timeout: number): this;
    allowEmptyResponse(): HttpBuilderOfT<T | null>;
    onReceived(callback: (received: T, response: HttpResponseOfT<T>) => void | Promise<any>): this;
    send(abortSignal?: AbortSignal): SendPromise<T>;
    transfer(abortSignal?: AbortSignal): Promise<T>;
    private handleReceive;
}
export interface Message {
    method: string;
    url: string;
    headers: Headers;
    content?: any;
    contentType?: string;
    mode?: RequestMode;
}
export interface SendPromise<T> extends Promise<HttpResponseOfT<T>> {
    thenReceive(): Promise<T>;
}
