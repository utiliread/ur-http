import { EventAggregator } from './event-aggregator';
import { HttpBuilder, HttpMethod, Message } from './http-builder';
import { HttpResponse, HttpResponseOfT } from './http-response';
import { QueryString } from './query-string';

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export class Http {
    static defaults: HttpOptions = {
        fetch: window.fetch ? window.fetch.bind(window) : undefined,
    }
    private static instance?: Http;
    options: HttpOptions;
    /** @internal */
    _onSend = new EventAggregator<[Message]>();
    /** @internal */
    _onSent = new EventAggregator<[HttpResponse, Message]>();
    /** @internal */
    _onReceived = new EventAggregator<[HttpResponseOfT<any>, Message, any]>();

    constructor(options?: Partial<HttpOptions>) {
        this.options = Object.assign({}, Http.defaults, options); // Later sources' properties overwrite earlier ones.
    }

    static request(method: HttpMethod, url: string, params?: any) {
        return this.getInstance().request(method, url, params);
    }

    static head(url: string, params?: any) {
        return this.getInstance().head(url, params);
    }

    static post(url: string, params?: any) {
        return this.getInstance().post(url, params);
    }

    static get(url: string, params?: any) {
        return this.getInstance().get(url, params);
    }

    static put(url: string, params?: any) {
        return this.getInstance().put(url, params);
    }

    static patch(url: string, params?: any) {
        return this.getInstance().patch(url, params);
    }

    static delete(url: string, params?: any) {
        return this.getInstance().delete(url, params);
    }

    private static getInstance() {
        if (!this.instance) {
            this.instance = new Http();
            // The singleton instance should always use the static options
            this.instance.options = Http.defaults;
        }
        return this.instance;
    }

    request(method: HttpMethod, url: string, params?: any) {
        const message = {
            method,
            url: url + QueryString.serialize(params),
            headers: new Headers()
        };
        const fetch = this.options.fetch;
        if (!fetch) {
            throw Error('fetch() is not properly configured');
        }
        const builder = new HttpBuilder(message, {
            fetch,
            timeout: this.options.timeout,
            baseUrl: this.options.baseUrl,
        }, this);
        return builder;
    }

    head(url: string, params?: any) {
        return this.request('HEAD', url, params);
    }

    post(url: string, params?: any) {
        return this.request('POST', url, params);
    }

    get(url: string, params?: any) {
        return this.request('GET', url, params);
    }

    put(url: string, params?: any) {
        return this.request('PUT', url, params);
    }

    patch(url: string, params?: any) {
        return this.request('PATCH', url, params);
    }

    delete(url: string, params?: any) {
        return this.request('DELETE', url, params);
    }

    onSend(callback: (request: Message) => void | Promise<void>) {
        return this._onSend.subscribe(callback);
    }

    onSent(callback: (response: HttpResponse, request: Message) => void | Promise<void>) {
        return this._onSent.subscribe(callback);
    }

    onReceived(callback: (response: HttpResponseOfT<any>, request: Message, value: any) => void | Promise<void>) {
        return this._onReceived.subscribe(callback);
    }
}

export interface HttpOptions {
    fetch?: Fetch,
    timeout?: number,
    baseUrl?: string,
}