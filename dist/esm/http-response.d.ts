export declare class HttpResponse {
    rawResponse: Response;
    readonly statusCode: number;
    readonly isInformational: boolean;
    readonly isSuccessful: boolean;
    readonly isRedirection: boolean;
    readonly isClientError: boolean;
    readonly isServerError: boolean;
    constructor(rawResponse: Response);
    ensureSuccessfulStatusCode(): this;
}
export declare class HttpResponseOfT<T> extends HttpResponse {
    private handler;
    constructor(rawResponse: Response, handler: (response: Response) => Promise<T>);
    receive(): Promise<T>;
}
