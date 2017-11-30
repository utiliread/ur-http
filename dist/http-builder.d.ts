import { HttpBuilderOfT } from './http-builder-of-t';
import { HttpResponse } from './http-response';
export declare class HttpBuilder {
    static fetch: typeof fetch;
    message: {
        method: string;
        url: string;
        content?: any;
        contentType?: string;
        headers: Headers;
    };
    fetch: typeof fetch;
    constructor(method: string, url: string);
    private withContent(content, contentType?);
    private useHandler<T>(handler);
    using(fetch: (input: RequestInfo) => Promise<Response>): this;
    send(): Promise<HttpResponse>;
    withForm(content: FormData, contentType?: string): this;
    withJson(content: any): this;
    addHeader(name: string, value: string): this;
    expectJson<T>(factory?: (object: any) => T): HttpBuilderOfT<T | null>;
}
