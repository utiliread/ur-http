import { duration, utc } from 'moment';

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

    client = HttpBuilder.client;
    
    constructor(method: string, url: string) {
        this.message = {
            method: method,
            url: url,
            headers: new Headers()
        };
    }

    private sendContent(content: any, contentType?: string) {
        this.message.content = content;
        this.message.contentType = contentType;
        return this;
    }

    private withHandler<T>(handler: (response: Response) => Promise<T>) {
        return new HttpBuilderOfT<T>(this, handler);
    }

    async send() {
        if (this.message.contentType) {
            this.message.headers.set('Content-Type', this.message.contentType);
        }

        let tic = utc();

        let response = await this.client.fetch(this.message.url, {
            method: this.message.method,
            body: this.message.content,
            headers: this.message.headers
        });

        var elapsed = duration(utc().diff(tic));

        console.log(`Received ${response.status} on ${response.url} in ${elapsed.asMilliseconds()}ms`);

        return new HttpResponse(response);
    }

    // Send Extensions

    sendForm(content: FormData, contentType?: string) {
        return this.sendContent(content, contentType);
    }

    sendJson(content: any) {
        return this.sendContent(JSON.stringify(content), 'application/json');
    }

    // Modifier Extensions

    addHeader(name: string, value: string) {
        this.message.headers.append(name, value);
        return this;
    }

    // Expect Extensions

    expectJson<T>(factory?: (object: any) => T) {
        this.message.headers.set('Accept', 'application/json');
        return this.withHandler(response => response.json().then(x => factory ? factory(x) : x));
    }
}