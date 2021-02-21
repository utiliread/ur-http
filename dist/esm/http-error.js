export class HttpError extends Error {
    constructor(statusCode, response = undefined) {
        super(`The response was not successful: ${statusCode}`);
        this.statusCode = statusCode;
        this.response = response;
        this.name = 'HttpError';
        // Set the prototype explicitly to allow for "... instanceof HttpError",
        // see https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, HttpError.prototype);
    }
    details() {
        const rawResponse = this.response?.rawResponse;
        if (rawResponse) {
            const contentType = rawResponse.headers.get("Content-Type");
            if (contentType && contentType.includes("application/problem+json")) {
                return rawResponse.json().then(details => details);
            }
        }
        return Promise.reject(new Error("There are no problem details in the response"));
    }
}
//# sourceMappingURL=http-error.js.map