import { HttpError } from './http-error';

export function isHttpError(error: Error): error is HttpError {
    return error.name === "HttpError";
}

export function isAbortError(error: Error): boolean {
    return error.name === "AbortError";
}