import { HttpBuilder } from './http-builder';
import { HttpResponse } from './http-response';
import { HttpResponseOfT } from './http-response-of-t';
import { SendPromise } from './send-promise';

export class HttpBuilderOfT<T> extends HttpBuilder {
    constructor(private inner: HttpBuilder, private handler: (response: Response) => Promise<T>) {
        super(inner.message, inner.fetch);
    }

    allowEmptyResponse() {
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }

            return this.handler(response);
        });
    }
    
    send(abortSignal?: any) {
        let responsePromise = this.inner.send(abortSignal).then(x => new HttpResponseOfT<T>(x.rawResponse, this.handler));
        
        return asSendPromise(responsePromise, () => responsePromise.then(response => response.receive()));
    }

    transfer(abortSignal?: any) {
        return this.send(abortSignal).thenReceive();
    }
}

function asSendPromise<T>(responsePromise: Promise<HttpResponse>, thenReceive: () => Promise<T>): SendPromise<T> {
    (responsePromise as SendPromise<T>).thenReceive = thenReceive;
    return responsePromise as SendPromise<T>;
}