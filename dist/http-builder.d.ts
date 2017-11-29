import { HttpBuilderOfT } from './http-builder-of-t';
export declare class HttpBuilder {
    message: {
        url: string;
        content?: any;
        contentType?: string;
        headers: Headers;
    };
    constructor(url: string);
    private sendContent(content, contentType?);
    private withHandler<T>(handler);
    sendForm(content: FormData, contentType?: string): this;
    sendJson(content: any): this;
    addHeader(name: string, value: string): this;
    expectJson<T>(): HttpBuilderOfT<any>;
}
