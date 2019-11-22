import { HttpResponse } from './http-response';
import { ProblemDetails } from './problem-details';
export declare class HttpError extends Error {
    statusCode: number;
    private response;
    constructor(statusCode: number, response?: HttpResponse | undefined);
    details<TDetails = ProblemDetails>(): Promise<TDetails>;
}
