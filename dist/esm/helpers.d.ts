import { HttpError } from './http-error';
import { TimeoutError } from './timeout-error';
export declare function isHttpError(error: Error): error is HttpError;
export declare function isAbortError(error: Error): boolean;
export declare function isTimeoutError(error: Error): error is TimeoutError;
