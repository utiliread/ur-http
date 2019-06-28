import { HttpError } from './http-error';
import { TimeoutError } from './timeout-error';

export function isHttpError(error: Error): error is HttpError {
    return error.name === "HttpError";
}

export function isAbortError(error: Error): boolean {
    return error.name === "AbortError";
}

export function isTimeoutError(error: Error): error is TimeoutError {
    return error.name === "TimeoutError";
}