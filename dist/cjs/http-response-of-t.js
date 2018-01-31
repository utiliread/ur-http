"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_response_1 = require("./http-response");
class HttpResponseOfT extends http_response_1.HttpResponse {
    constructor(rawResponse, handler) {
        super(rawResponse);
        this.handler = handler;
    }
    receive() {
        return this.handler(this.rawResponse);
    }
}
exports.HttpResponseOfT = HttpResponseOfT;
//# sourceMappingURL=http-response-of-t.js.map