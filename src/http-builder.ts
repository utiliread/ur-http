import { Fetch, Options } from './http';
import { HttpResponse, HttpResponseOfT } from './http-response';
import { TimeoutError } from './timeout-error';
import { Settings } from './settings';
import { HttpEvent } from './events';
import { EventAggregator } from '.';

type Reducer<P extends any[] = any[]> = (...params: P) => unknown;

export class HttpBuilder {
    private _ensureSuccessStatusCode = true;
    private _onSend: ((request: Message) => void | Promise<any>)[] = [];
    private _onSent: ((response: HttpResponse) => void | Promise<any>)[] = [];

    constructor(public message: Message, public options: Options, public eventAggregator: EventAggregator) {
        if (options.onSent) {
            this._onSent.push(options.onSent);
        }
    }

    onSend(callback: (request: Message) => void | Promise<any>) {
        this._onSend.push(callback);
        return this;
    }

    onSent(callback: (response: HttpResponse) => void | Promise<any>) {
        this._onSent.push(callback);
        return this;
    }

    onSentPublishEvent<P extends any[]>(reducer: Reducer<P>, ...params: P) {
        this._onSent.push(response => {
            const event = new HttpEvent();
            event.hook = "sent";
            event.url = response.url;
            event.reducer = reducer;
            event.params = params;
            event.response = response;
            return this.eventAggregator.publish(event);
        })
        return this;
    }

    protected useHandler<T>(handler: (response: Response) => Promise<T>) {
        return new HttpBuilderOfT<T>(this, handler);
    }

    async send(abortSignal?: AbortSignal) {
        if (!this.options.fetch) {
            throw Error('fetch() is not properly configured');
        }

        if (this.message.contentType) {
            this.message.headers.set('Content-Type', this.message.contentType);
        }

        for (const callback of this._onSend) {
            await Promise.resolve(callback(this.message));
        }

        const init: RequestInit = {
            method: this.message.method,
            body: this.message.content,
            headers: this.message.headers,
            mode: this.message.mode
        };

        if (abortSignal || this.options.timeout) {
            var outerController = new AbortController();

            if (abortSignal) {
                abortSignal.addEventListener("abort", () => {
                    outerController.abort();
                });
            }

            init.signal = outerController.signal;
        }

        const url = this.getUrl();
        const fetchResponsePromise = this.options.fetch(url, init);
        let fetchResponse: Response;

        if (this.options.timeout) {
            fetchResponse = await Promise.race([
                fetchResponsePromise,
                new Promise<Response>((_, reject) => setTimeout(() => {
                    outerController.abort();
                    reject(new TimeoutError());
                }, this.options.timeout))
            ]);
        }
        else {
            fetchResponse = await fetchResponsePromise;
        }

        const httpResponse = new HttpResponse(fetchResponse);

        if (this._ensureSuccessStatusCode) {
            httpResponse.ensureSuccessfulStatusCode();
        }

        for (const callback of this._onSent) {
            await Promise.resolve(callback(httpResponse));
        }

        return httpResponse;
    }

    getUrl() {
        let baseUrl = this.options.baseUrl;
        if (!baseUrl) {
            return this.message.url;
        }

        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.substr(0, baseUrl.length - 1);
        }

        if (this.message.url.startsWith('/')) {
            return baseUrl + this.message.url;
        }
        else {
            return baseUrl + '/' + this.message.url;
        }
    }

    ensureSuccessStatusCode(ensureSuccessStatusCode?: boolean) {
        this._ensureSuccessStatusCode = ensureSuccessStatusCode === false ? false : true;

        return this;
    }

    use(settings: Settings) {
        if (settings.fetch) {
            this.useFetch(settings.fetch);
        }
        if (settings.corsMode) {
            this.useCors(settings.corsMode);
        }
        if (settings.baseUrl) {
            this.useBaseUrl(settings.baseUrl);
        }
        return this;
    }

    useFetch(fetch: Fetch) {
        this.options.fetch = fetch;
        return this;
    }

    useCors(mode: RequestMode) {
        this.message.mode = mode;
        return this;
    }

    useBaseUrl(baseUrl: string) {
        this.options.baseUrl = baseUrl;
        return this;
    }

    useTimeout(timeout: number | null) {
        this.options.timeout = timeout || undefined;
        return this;
    }

    // Content Extensions

    with(content: any, contentType?: string) {
        this.message.content = content;
        this.message.contentType = contentType;
        return this;
    }

    withForm(content: FormData) {
        this.message.content = content;
        this.message.contentType = undefined;
        return this;
    }

    // Modifier Extensions

    addHeader(name: string, value: string) {
        this.message.headers.append(name, value);
        return this;
    }

    // Expect Extensions

    expectString() {
        return this.useHandler(response => {
            return response.text();
        });
    }

    expectBinary() {
        return this.useHandler(response => {
            return response.arrayBuffer();
        });
    }
}

export class HttpBuilderOfT<T> extends HttpBuilder {
    private _onReceived: ((response: HttpResponseOfT<T>, value: T) => void | Promise<any>)[] = [];

    constructor(private inner: HttpBuilder, private handler: (response: Response) => Promise<T>) {
        super(inner.message, inner.options, inner.eventAggregator);

        if (inner.options.onReceived) {
            this._onReceived.push(inner.options.onReceived);
        }
    }

    onSend(callback: (request: Message) => void | Promise<any>) {
        this.inner.onSend(callback);
        return this;
    }

    onSent(callback: (response: HttpResponse) => void | Promise<any>) {
        this.inner.onSent(callback);
        return this;
    }

    onSentPublishEvent<P extends any[]>(reducer: Reducer<P>, ...params: P) {
        this.inner.onSentPublishEvent(reducer, ...params);
        return this;
    }

    ensureSuccessStatusCode(ensureSuccessStatusCode?: boolean) {
        this.inner.ensureSuccessStatusCode(ensureSuccessStatusCode);
        return this;
    }

    use(settings: Settings) {
        this.inner.use(settings);
        return this;
    }

    useFetch(fetch: Fetch) {
        this.inner.useFetch(fetch);
        return this;
    }

    useCors(mode: RequestMode) {
        this.inner.useCors(mode);
        return this;
    }

    useBaseUrl(baseUrl: string) {
        this.inner.useBaseUrl(baseUrl);
        return this;
    }

    useTimeout(timeout: number) {
        this.inner.useTimeout(timeout);
        return this;
    }

    allowEmptyResponse() {
        if (this._onReceived.length) {
            throw new Error("onReceived() should only be called after allowEmptyResponse()");
        }

        return new HttpBuilderOfT<T | null>(this.inner, response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }

            return this.handler(response);
        });
    }

    onReceived(callback: (response: HttpResponseOfT<T>, value: T) => void | Promise<any>) {
        this._onReceived.push(callback);
        return this;
    }

    onReceivedPublishEvent<P extends any[]>(reducer: Reducer<P>, ...params: P) {
        this._onReceived.push((response, value) => {
            const event = new HttpEvent();
            event.hook = "received";
            event.url = response.url;
            event.reducer = reducer;
            event.params = params;
            event.response = response;
            event.value = value;
            return this.eventAggregator.publish(event);
        })
        return this;
    }

    send(abortSignal?: AbortSignal) {
        const responsePromise = this.inner.send(abortSignal).then(x => new HttpResponseOfT<T>(x.rawResponse, this.handler));

        return asSendPromise(responsePromise, () => responsePromise.then(response => this.handleReceive(response)));
    }

    transfer(abortSignal?: AbortSignal) {
        return this.send(abortSignal).then(response => this.handleReceive(response));
    }

    private async handleReceive(response: HttpResponseOfT<T>) {
        const value = await response.receive();

        for (const callback of this._onReceived) {
            await Promise.resolve(callback(response, value));
        }

        return value;
    }
}

export interface Message {
    method: string;
    baseUrl?: string;
    url: string;
    headers: Headers;
    content?: any;
    contentType?: string;
    mode?: RequestMode;
}

export interface SendPromise<T> extends Promise<HttpResponseOfT<T>> {
    thenReceive(): Promise<T>;
}

function asSendPromise<T>(responsePromise: Promise<HttpResponse>, thenReceive: () => Promise<T>): SendPromise<T> {
    (responsePromise as SendPromise<T>).thenReceive = thenReceive;
    return responsePromise as SendPromise<T>;
}