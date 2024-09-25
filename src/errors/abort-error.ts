export interface AbortError extends Error {
  readonly name: "AbortError";
}

export function isAbortError(error: unknown): error is AbortError {
  return error instanceof Error && error.name === "AbortError";
}
