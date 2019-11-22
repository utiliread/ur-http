export declare class HttpResponse {
    rawResponse: Response;
    get url(): string;
    get statusCode(): number;
    get isInformational(): boolean;
    get isSuccessful(): boolean;
    get isRedirection(): boolean;
    get isClientError(): boolean;
    get isServerError(): boolean;
    constructor(rawResponse: Response);
    ensureSuccessfulStatusCode(): this;
}
export declare class HttpResponseOfT<T> extends HttpResponse {
    private handler;
    constructor(rawResponse: Response, handler: (response: Response) => Promise<T>);
    receive(): Promise<T>;
}
