import { HttpBuilder } from './http-builder';
import { HttpResponse } from './http-response';
import { HttpResponseOfT } from './http-response-of-t';
import { SendPromise } from './send-promise';

export class HttpBuilderOfT<T> {
    constructor(private inner: HttpBuilder, private handler: (response: Response) => Promise<T>) {
    }
    
    send(abortSignal?: any) {
        let responsePromise = this.inner.send(abortSignal).then(x => new HttpResponseOfT<T>(x.rawResponse, this.handler));
        
        return asSendPromise(responsePromise, () => responsePromise.then(response => response.receive()));
    }

    transfer(abortSignal?: any, ensureSuccessStatusCode?: boolean) {
        return this.send(abortSignal).then(response => {
            if (ensureSuccessStatusCode !== false) {
                response.ensureSuccessfulStatusCode();
            }
            return response.receive();
        });
    }
}

function asSendPromise<T>(responsePromise: Promise<HttpResponse>, thenReceive: () => Promise<T>): SendPromise<T> {
    (responsePromise as SendPromise<T>).thenReceive = thenReceive;
    return responsePromise as SendPromise<T>;
}