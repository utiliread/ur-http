import { HttpBuilderOfT } from './http-builder-of-t';
import { HttpClient } from 'aurelia-fetch-client';
import { HttpResponse } from './http-response';

export class HttpBuilder {
    private static client = new HttpClient();
    
    message: {
        method: string;
        url: string;
        content?: any;
        contentType?: string;
        headers: Headers;
    };

    client = HttpBuilder.client; // Default client
    
    constructor(method: string, url: string) {
        this.message = {
            method: method,
            url: url,
            headers: new Headers()
        };
    }

    private withContent(content: any, contentType?: string) {
        this.message.content = content;
        this.message.contentType = contentType;
        return this;
    }

    private useHandler<T>(handler: (response: Response) => Promise<T>) {
        return new HttpBuilderOfT<T>(this, handler);
    }

    using(client: HttpClient) {
        this.client = client;
        return this;
    }

    async send() {
        if (this.message.contentType) {
            this.message.headers.set('Content-Type', this.message.contentType);
        }

        let response = await this.client.fetch(this.message.url, {
            method: this.message.method,
            body: this.message.content,
            headers: this.message.headers
        });

        return new HttpResponse(response);
    }

    // Content Extensions

    withForm(content: FormData, contentType?: string) {
        return this.withContent(content, contentType);
    }

    withJson(content: any) {
        return this.withContent(JSON.stringify(content), 'application/json');
    }

    // Modifier Extensions

    addHeader(name: string, value: string) {
        this.message.headers.append(name, value);
        return this;
    }

    // Expect Extensions

    expectJson<T>(factory?: (object: any) => T) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => response.json().then(x => factory ? factory(x) : <T>x));
    }
}