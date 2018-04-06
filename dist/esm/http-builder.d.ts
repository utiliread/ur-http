import { Fetch } from './http';
import { HttpBuilderOfT } from './http-builder-of-t';
import { HttpResponse } from './http-response';
export declare class HttpBuilder {
    message: Message;
    fetch: Fetch | undefined;
    constructor(message: Message, fetch: Fetch | undefined);
    static create(method: string, url: string): HttpBuilder;
    using(fetch: Fetch): this;
    protected useHandler<T>(handler: (response: Response) => Promise<T>): HttpBuilderOfT<T>;
    send(abortSignal?: any): Promise<HttpResponse>;
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
}
export interface Message {
    method: string;
    url: string;
    headers: Headers;
    content?: any;
    contentType?: string;
}
