import { HttpBuilder } from './http-builder';
import { HttpResponse } from './http-response';
import { SendPromise } from './send-promise';

export class HttpBuilderOfT<T> {
    constructor(private inner: HttpBuilder, private handler: (response: Response) => Promise<T>) {
    }
    
    send() {
        let responsePromise = this.inner.send();
        
        return asSendPromise(responsePromise, () => responsePromise.then(response => this.handler(response.rawResponse)));
    }

    transfer() {
        return this.send().thenReceive();
    }
}

function asSendPromise<T>(responsePromise: Promise<HttpResponse>, thenReceive: () => Promise<T>): SendPromise<T> {
    (responsePromise as SendPromise<T>).thenReceive = thenReceive;
    return responsePromise as SendPromise<T>;
  }