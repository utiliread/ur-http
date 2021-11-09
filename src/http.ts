import { DefaultEventAggregator, EventAggregator } from './events';
import { HttpBuilder } from './http-builder';
import { HttpResponse, HttpResponseOfT } from './http-response';
import { QueryString } from './query-string';

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export class Http {
    static defaults: Options = {
        fetch: window.fetch ? window.fetch.bind(window) : undefined,
    }
    private static instance?: Http;
    options: Readonly<Options>;
    eventAggregator: EventAggregator = new DefaultEventAggregator();

    constructor(options?: Partial<Options>) {
        this.options = Object.assign({}, Http.defaults, options); // Later sources' properties overwrite earlier ones.
    }

    static request(method: string, url: string, params?: any) {
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

    request(method: string, url: string, params?: any) {
        const message = {
            method,
            url: url + QueryString.serialize(params),
            headers: new Headers()
        };
        const options = Object.assign({}, this.options);
        return new HttpBuilder(message, options, this.eventAggregator);
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
}

export interface Options {
    fetch?: Fetch,
    timeout?: number,
    baseUrl?: string,
    onSent?: (response: HttpResponse) => void | Promise<any>;
    onReceived?: <T>(response: HttpResponseOfT<T>, value: T) => void | Promise<any>;
}