import { HttpBuilderOfT } from './http-builder-of-t';
import { HttpClient } from 'aurelia-fetch-client';
import { HttpResponse } from './http-response';
export declare class HttpBuilder {
    private static client;
    message: {
        method: string;
        url: string;
        content?: any;
        contentType?: string;
        headers: Headers;
    };
    client: HttpClient;
    constructor(method: string, url: string);
    private withContent(content, contentType?);
    private useHandler<T>(handler);
    using(client: HttpClient): this;
    send(): Promise<HttpResponse>;
    withForm(content: FormData, contentType?: string): this;
    withJson(content: any): this;
    addHeader(name: string, value: string): this;
    expectJson<T>(factory?: (object: any) => T): HttpBuilderOfT<T | null>;
}
