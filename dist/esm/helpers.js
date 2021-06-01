export function isHttpError(error) {
    return error.name === "HttpError";
}
export function isAbortError(error) {
    return error.name === "AbortError";
}
export function isTimeoutError(error) {
    return error.name === "TimeoutError";
}
//# sourceMappingURL=helpers.js.map