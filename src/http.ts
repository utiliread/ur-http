import { HttpBuilder } from './http-builder';

export class Http {
    static request(method: string, url: string) {
        return new HttpBuilder(method, url);
    }

    static post(url: string) {
        return new HttpBuilder('POST', url);
    }

    static get(url: string) {
        return new HttpBuilder('GET', url);
    }

    static put(url: string) {
        return new HttpBuilder('PUT', url);
    }

    static patch(url: string) {
        return new HttpBuilder('PATCH', url);
    }

    static delete(url: string) {
        return new HttpBuilder('DELETE', url);
    }
}