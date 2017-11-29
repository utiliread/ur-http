import { HttpBuilder } from './http-builder';
import { HttpResponseOfT } from './http-response-of-t';

export class HttpBuilderOfT<T> {
    constructor(public inner: HttpBuilder, public handler: (response: Response) => Promise<T>) {
    }

    async send() {
        let response = await this.inner.send();

        let data = await this.handler(response.rawResponse);

        return new HttpResponseOfT(response.rawResponse, data);
    }

    receive() {
        return this.send().then(x => x.data);
    }
}