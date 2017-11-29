import { HttpBuilder } from './http-builder';
import { QueryString } from './query-string';

export class Http {
    static request(method: string, url: string, params?: any) {
        return new HttpBuilder(method, url + QueryString.serialize(params));
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