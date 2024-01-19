import { HttpError } from "./http-error";

export class HttpResponse {
  get url() {
    return this.rawResponse.url;
  }

  get statusCode() {
    return this.rawResponse.status;
  }

  get headers() {
    return this.rawResponse.headers;
  }

  get isInformational() {
    return this.statusCode >= 100 && this.statusCode < 200;
  }

  get isSuccessful() {
    return this.statusCode >= 200 && this.statusCode < 300;
  }

  get isRedirection() {
    return this.statusCode >= 300 && this.statusCode < 400;
  }

  get isClientError() {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  get isServerError() {
    return this.statusCode >= 500 && this.statusCode < 600;
  }

  constructor(public rawResponse: Response) {}

  public ensureSuccessfulStatusCode() {
    if (!this.isSuccessful) {
      throw new HttpError(this.statusCode, this);
    }

    return this;
  }
}

export class HttpResponseOfT<T> extends HttpResponse {
  constructor(
    rawResponse: Response,
    private handler: (response: HttpResponse) => Promise<T>,
  ) {
    super(rawResponse);
  }

  receive() {
    return this.handler(this);
  }
}
