import { HttpBuilder } from './http-builder';
import { QueryString } from './query-string';

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export class Http {
    static defaults: {
        fetch: Fetch | undefined
    } = {
        fetch: window.fetch ? window.fetch.bind(window) : undefined
    }

    static request(method: string, url: string, params?: any) {
        return HttpBuilder.create(method, url + QueryString.serialize(params));
    }

    static head(url: string, params?: any) {
        return Http.request('HEAD', url, params);
    }

    static post(url: string, params?: any) {
        return Http.request('POST', url, params);
    }

    static get(url: string, params?: any) {
        return Http.request('GET', url, params);
    }

    static put(url: string, params?: any) {
        return Http.request('PUT', url, params);
    }

    static patch(url: string, params?: any) {
        return Http.request('PATCH', url, params);
    }

    static delete(url: string, params?: any) {
        return Http.request('DELETE', url, params);
    }
}