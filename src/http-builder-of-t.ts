import { duration, utc } from 'moment';

import { HttpBuilder } from './http-builder';
import { HttpClient } from 'aurelia-fetch-client';
import { HttpResponseOfT } from './http-response-of-t';

export class HttpBuilderOfT<T> {
    private static client = new HttpClient();

    constructor(public inner: HttpBuilder, public handler: (response: Response) => Promise<T>) {
    }

    private async send(method: string) {
        let message = this.inner.message;

        if (message.contentType) {
            message.headers.set('Content-Type', message.contentType);
        }

        let tic = utc();

        let response = await HttpBuilderOfT.client.fetch(message.url, {
            method: method,
            body: message.content,
            headers: message.headers
        });

        var elapsed = duration(utc().diff(tic));

        console.log(`Received ${response.status} on ${response.url} in ${elapsed.asMilliseconds()}ms`);

        let data = await this.handler(response);

        return new HttpResponseOfT(response, data);
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