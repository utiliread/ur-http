export class HttpError extends Error {
    constructor(public statusCode: number) {
        super(`The response was not successful indicated by status code ${statusCode}`);
        this.name = 'HttpError';
    }
}