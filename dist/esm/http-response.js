export class HttpResponse {
    constructor(rawResponse) {
        this.rawResponse = rawResponse;
    }
    get isInformational() {
        return this.rawResponse.status >= 100 && this.rawResponse.status < 200;
    }
    get isSuccessful() {
        return this.rawResponse.status >= 200 && this.rawResponse.status < 300;
    }
    get isRedirection() {
        return this.rawResponse.status >= 300 && this.rawResponse.status < 400;
    }
    get isClientError() {
        return this.rawResponse.status >= 400 && this.rawResponse.status < 500;
    }
    get isServerError() {
        return this.rawResponse.status >= 500 && this.rawResponse.status < 600;
    }
}
//# sourceMappingURL=http-response.js.map