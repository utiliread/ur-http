export declare class HttpResponse {
    rawResponse: Response;
    readonly isInformational: boolean;
    readonly isSuccessful: boolean;
    readonly isRedirection: boolean;
    readonly isClientError: boolean;
    readonly isServerError: boolean;
    constructor(rawResponse: Response);
}
