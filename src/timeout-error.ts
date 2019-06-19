export class TimeoutError extends Error {
    constructor() {
        super("The requiest was not successful");
        this.name = 'TimeoutError';

        // Set the prototype explicitly to allow for "... instanceof TimeoutError",
        // see https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}