import { HttpBuilder } from './http-builder';
export declare type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
export declare class Http {
    static defaults: Options;
    private static instance;
    options: Options;
    constructor(options?: Options);
    static request(method: string, url: string, params?: any): HttpBuilder;
    static head(url: string, params?: any): HttpBuilder;
    static post(url: string, params?: any): HttpBuilder;
    static get(url: string, params?: any): HttpBuilder;
    static put(url: string, params?: any): HttpBuilder;
    static patch(url: string, params?: any): HttpBuilder;
    static delete(url: string, params?: any): HttpBuilder;
    request(method: string, url: string, params?: any): HttpBuilder;
    head(url: string, params?: any): HttpBuilder;
    post(url: string, params?: any): HttpBuilder;
    get(url: string, params?: any): HttpBuilder;
    put(url: string, params?: any): HttpBuilder;
    patch(url: string, params?: any): HttpBuilder;
    delete(url: string, params?: any): HttpBuilder;
}
export interface Options {
    fetch?: Fetch;
    timeout?: number;
    baseUrl?: string;
}
