import { HttpBuilder } from './http-builder';
import { QueryString } from './query-string';

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export class Http {
    static defaults: Defaults = {
        fetch: window.fetch ? window.fetch.bind(window) : undefined
    }
    private static instance = new Http(Http.defaults);
    defaults: Defaults;

    constructor(defaults?: Defaults) {
        this.defaults = Object.assign({}, Http.defaults, defaults); // Later sources' properties overwrite earlier ones.
    }

    static request(method: string, url: string, params?: any) {
        return this.instance.request(method, url, params);
    }

    static head(url: string, params?: any) {
        return this.instance.head(url, params);
    }

    static post(url: string, params?: any) {
        return this.instance.post(url, params);
    }

    static get(url: string, params?: any) {
        return this.instance.get(url, params);
    }

    static put(url: string, params?: any) {
        return this.instance.put(url, params);
    }

    static patch(url: string, params?: any) {
        return this.instance.patch(url, params);
    }

    static delete(url: string, params?: any) {
        return this.instance.delete(url, params);
    }

    request(method: string, url: string, params?: any) {
        const message = {
            method,
            url: url + QueryString.serialize(params),
            headers: new Headers()
        };
        return new HttpBuilder(message, this.defaults.fetch, this.defaults.timeout);
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

interface Defaults {
    fetch?: Fetch,
    timeout?: number,
}