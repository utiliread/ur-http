var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { duration, utc } from 'moment';
import { HttpClient } from 'aurelia-fetch-client';
import { HttpResponseOfT } from './http-response-of-t';
var HttpBuilderOfT = /** @class */ (function () {
    function HttpBuilderOfT(inner, handler) {
        this.inner = inner;
        this.handler = handler;
    }
    HttpBuilderOfT.prototype.send = function (method) {
        return __awaiter(this, void 0, void 0, function () {
            var message, tic, response, elapsed, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.inner.message;
                        if (message.contentType) {
                            message.headers.set('Content-Type', message.contentType);
                        }
                        tic = utc();
                        return [4 /*yield*/, HttpBuilderOfT.client.fetch(message.url, {
                                method: method,
                                body: message.content,
                                headers: message.headers
                            })];
                    case 1:
                        response = _a.sent();
                        elapsed = duration(utc().diff(tic));
                        console.log("Received " + response.status + " on " + response.url + " in " + elapsed.asMilliseconds() + "ms");
                        return [4 /*yield*/, this.handler(response)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, new HttpResponseOfT(response, data)];
                }
            });
        });
    };
    // Verb Extensions
    HttpBuilderOfT.prototype.post = function () {
        return this.send('POST');
    };
    HttpBuilderOfT.prototype.get = function () {
        return this.send('GET');
    };
    HttpBuilderOfT.prototype.put = function () {
        return this.send('PUT');
    };
    HttpBuilderOfT.prototype.patch = function () {
        return this.send('PATCH');
    };
    HttpBuilderOfT.prototype.delete = function () {
        return this.send('DELETE');
    };
    HttpBuilderOfT.client = new HttpClient();
    return HttpBuilderOfT;
}());
export { HttpBuilderOfT };
