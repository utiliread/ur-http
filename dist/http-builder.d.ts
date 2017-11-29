import { HttpBuilderOfT } from './http-builder-of-t';
export declare class HttpBuilder {
    message: {
        url: string;
        content?: any;
        contentType?: string;
        headers: Headers;
    };
    constructor(url: string);
    sendContent(content: any, contentType?: string): this;
    withHandler<T>(handler: (response: Response) => Promise<T>): HttpBuilderOfT<T>;
    sendForm(content: FormData, contentType?: string): this;
    sendJson(content: any): this;
    addHeader(name: string, value: string): this;
    expectJson<T>(): HttpBuilderOfT<any>;
}
