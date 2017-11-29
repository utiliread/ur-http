import { HttpBuilder } from './http-builder';
export declare class Http {
    static request(method: string, url: string): HttpBuilder;
    static post(url: string): HttpBuilder;
    static get(url: string): HttpBuilder;
    static put(url: string): HttpBuilder;
    static patch(url: string): HttpBuilder;
    static delete(url: string): HttpBuilder;
}
