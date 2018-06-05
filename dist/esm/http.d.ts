import { HttpBuilder } from './http-builder';
export declare type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
export declare class Http {
    static defaults: {
        fetch: Fetch | undefined;
    };
    static request(method: string, url: string, params?: any): HttpBuilder;
    static head(url: string, params?: any): HttpBuilder;
    static post(url: string, params?: any): HttpBuilder;
    static get(url: string, params?: any): HttpBuilder;
    static put(url: string, params?: any): HttpBuilder;
    static patch(url: string, params?: any): HttpBuilder;
    static delete(url: string, params?: any): HttpBuilder;
}
