import { HttpBuilder } from './http-builder';
export declare class Http {
    static request(method: string, url: string, params?: any): HttpBuilder;
    static post(url: string, params?: any): HttpBuilder;
    static get(url: string, params?: any): HttpBuilder;
    static put(url: string, params?: any): HttpBuilder;
    static patch(url: string, params?: any): HttpBuilder;
    static delete(url: string, params?: any): HttpBuilder;
}
