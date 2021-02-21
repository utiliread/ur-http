import { HttpError } from "./http-error";
export class HttpResponse {
    constructor(rawResponse) {
        this.rawResponse = rawResponse;
    }
    get url() {
        return this.rawResponse.url;
    }
    get statusCode() {
        return this.rawResponse.status;
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
    ensureSuccessfulStatusCode() {
        if (!this.isSuccessful) {
            throw new HttpError(this.statusCode, this);
        }
        return this;
    }
}
export class HttpResponseOfT extends HttpResponse {
    constructor(rawResponse, handler) {
        super(rawResponse);
        this.handler = handler;
    }
    receive() {
        return this.handler(this.rawResponse);
    }
}
//# sourceMappingURL=http-response.js.map