"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var http_response_1 = require("./http-response");
var HttpResponseOfT = /** @class */ (function (_super) {
    __extends(HttpResponseOfT, _super);
    function HttpResponseOfT(rawResponse, handler) {
        var _this = _super.call(this, rawResponse) || this;
        _this.handler = handler;
        return _this;
    }
    HttpResponseOfT.prototype.receive = function () {
        return this.handler(this.rawResponse);
    };
    return HttpResponseOfT;
}(http_response_1.HttpResponse));
exports.HttpResponseOfT = HttpResponseOfT;
//# sourceMappingURL=http-response-of-t.js.map