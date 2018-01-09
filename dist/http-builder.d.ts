import { PaginationResult } from './pagination';
import { HttpBuilderOfT } from './http-builder-of-t';
import { HttpResponse } from './http-response';
export declare class HttpBuilder {
    static defaultFetch: typeof fetch;
    message: {
        method: string;
        url: string;
        headers: Headers;
        content?: any;
        contentType?: string;
    };
    fetch: typeof fetch;
    constructor(method: string, url: string);
    using(fetch: (input: RequestInfo) => Promise<Response>): this;
    private useHandler<T>(handler);
    send(abortSignal?: any): Promise<HttpResponse>;
    withForm(content: FormData): this;
    withJson(content: any): this;
    addHeader(name: string, value: string): this;
    expectJson<T>(typeCtorOrFactory?: {
        new (): T;
    } | ((object: any) => T)): HttpBuilderOfT<T | null | undefined>;
    expectJsonArray<T>(itemTypeCtorOrFactory: {
        new (): T;
    } | ((item: any) => T)): HttpBuilderOfT<(T | null | undefined)[] | null>;
    expectJsonPaginationResult<T>(itemTypeCtorOrFactory: {
        new (): T;
    } | ((item: any) => T)): HttpBuilderOfT<PaginationResult<T> | null>;
}
