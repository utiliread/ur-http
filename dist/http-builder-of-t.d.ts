import { HttpBuilder } from './http-builder';
export declare class HttpBuilderOfT<T> {
    inner: HttpBuilder;
    handler: (response: Response) => Promise<T>;
    private static client;
    constructor(inner: HttpBuilder, handler: (response: Response) => Promise<T>);
    send(method: string): Promise<T>;
    post(): Promise<T>;
    get(): Promise<T>;
    put(): Promise<T>;
    patch(): Promise<T>;
    delete(): Promise<T>;
}
