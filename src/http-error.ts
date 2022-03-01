import { HttpResponse } from './http-response';
import { ProblemDetails } from './problem-details';

export class HttpError extends Error {
    get hasDetails() {
        const contentType = this.response?.rawResponse?.headers.get("Content-Type");
        return contentType?.includes("application/problem+json");
    }

    constructor(public statusCode: number, private response: HttpResponse | undefined = undefined) {
        super(`The response was not successful: ${statusCode}`);
        this.name = 'HttpError';

        // Set the prototype explicitly to allow for "... instanceof HttpError",
        // see https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, HttpError.prototype);
    }

    details<TDetails = ProblemDetails>() {
        const rawResponse = this.response?.rawResponse;

        if (rawResponse && this.hasDetails) {
            return rawResponse.json().then(details => <TDetails>details);
        }

        return Promise.reject(new Error("There are no problem details in the response"));
    }
}