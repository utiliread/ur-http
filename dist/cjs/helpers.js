"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTimeoutError = exports.isAbortError = exports.isHttpError = void 0;
function isHttpError(error) {
    return error.name === "HttpError";
}
exports.isHttpError = isHttpError;
function isAbortError(error) {
    return error.name === "AbortError";
}
exports.isAbortError = isAbortError;
function isTimeoutError(error) {
    return error.name === "TimeoutError";
}
exports.isTimeoutError = isTimeoutError;
//# sourceMappingURL=helpers.js.map