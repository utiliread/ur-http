import { PaginationResult } from './pagination';
import { HttpBuilderOfT } from './http-builder-of-t';
import { HttpResponse } from './http-response';
export declare class HttpBuilder {
    static defaultFetch: any;
    message: {
        method: string;
        url: string;
        headers: Headers;
        content?: any;
        contentType?: string;
    };
    fetch: any;
    constructor(method: string, url: string);
    using(fetch: (input: RequestInfo) => Promise<Response>): this;
    private useHandler<T>(handler);
    send(abortSignal?: any): Promise<HttpResponse>;
    withForm(content: FormData): this;
    withJson(content: any): this;
    addHeader(name: string, value: string): this;
    expectString(): HttpBuilderOfT<string | null>;
    expectBinary(): HttpBuilderOfT<ArrayBuffer | null>;
    expectJson<T>(typeCtorOrFactory?: {
        new (): T;
    } | ((object: any) => T)): HttpBuilderOfT<T | null>;
    expectJsonArray<T>(itemTypeCtorOrFactory: {
        new (): T;
    } | ((item: any) => T)): HttpBuilderOfT<(T | null)[] | null>;
    expectJsonPaginationResult<T>(itemTypeCtorOrFactory: {
        new (): T;
    } | ((item: any) => T)): HttpBuilderOfT<PaginationResult<T | null> | null>;
}
