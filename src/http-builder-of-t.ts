import { HttpBuilder } from './http-builder';
import { HttpClient } from 'aurelia-fetch-client';
import { HttpResponse } from './http-response';

export class HttpBuilderOfT<T> {
    private static client = new HttpClient();
    
    constructor(public inner: HttpBuilder, public handler: (response: Response) => Promise<T>) {
    }

    async send(method: string) {
        let message = this.inner.message;

        if (message.contentType) {
            message.headers.set('Content-Type', message.contentType);
        }

        let response = await HttpBuilderOfT.client.fetch(message.url, {
            method: method,
            body: message.content,
            headers: message.headers
        });

        let result = await this.handler(response);

        return result;
    }

    // Verb Extensions

    post() {
        return this.send('POST');
    }

    get() {
        return this.send('GET');
    }

    put() {
        return this.send('PUT');
    }

    patch() {
        return this.send('PATCH');
    }

    delete() {
        return this.send('DELETE');
    }
}