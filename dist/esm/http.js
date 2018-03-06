import { HttpBuilder } from './http-builder';
import { QueryString } from './query-string';
export class Http {
    static request(method, url, params) {
        return new HttpBuilder(method, url + QueryString.serialize(params));
    }
    static head(url, params) {
        return Http.request('HEAD', url, params);
    }
    static post(url, params) {
        return Http.request('POST', url, params);
    }
    static get(url, params) {
        return Http.request('GET', url, params);
    }
    static put(url, params) {
        return Http.request('PUT', url, params);
    }
    static patch(url, params) {
        return Http.request('PATCH', url, params);
    }
    static delete(url, params) {
        return Http.request('DELETE', url, params);
    }
}
Http.defaults = {
    fetch: window.fetch ? window.fetch.bind(window) : undefined
};
//# sourceMappingURL=http.js.map