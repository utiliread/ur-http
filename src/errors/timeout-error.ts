export class TimeoutError extends Error {
  readonly name: "TimeoutError" = "TimeoutError";

  constructor() {
    super("Timeout: The request was not successful");

    // Set the prototype explicitly to allow for "... instanceof TimeoutError",
    // see https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof Error && error.name === "TimeoutError";
}
