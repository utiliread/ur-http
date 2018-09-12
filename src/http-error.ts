export class HttpError extends Error {
    constructor(public statusCode: number) {
        super(`The response was not successful: ${statusCode}`);
        this.name = 'HttpError';

        // Set the prototype explicitly to allow for "... instanceof HttpError",
        // see https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}