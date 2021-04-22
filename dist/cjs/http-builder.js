"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpBuilderOfT = exports.HttpBuilder = void 0;
var http_1 = require("./http");
var http_response_1 = require("./http-response");
var ur_json_1 = require("ur-json");
var jsonFactory = require("./json");
var timeout_error_1 = require("./timeout-error");
var HttpBuilder = /** @class */ (function () {
    function HttpBuilder(message, fetch, timeout) {
        this.message = message;
        this.fetch = fetch;
        this.timeout = timeout;
        this._ensureSuccessStatusCode = true;
        this._onSend = [];
        this._onSent = [];
    }
    HttpBuilder.create = function (method, url) {
        return new HttpBuilder({
            method: method,
            url: url,
            headers: new Headers()
        }, http_1.Http.defaults.fetch, http_1.Http.defaults.timeout);
    };
    HttpBuilder.prototype.onSend = function (callback) {
        this._onSend.push(callback);
        return this;
    };
    HttpBuilder.prototype.onSent = function (callback) {
        this._onSent.push(callback);
        return this;
    };
    HttpBuilder.prototype.useHandler = function (handler) {
        return new HttpBuilderOfT(this, handler);
    };
    HttpBuilder.prototype.send = function (abortSignal) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, callback, init, outerController, fetchResponsePromise, fetchResponse, httpResponse, _b, _c, callback;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.fetch) {
                            throw Error('fetch() is not properly configured');
                        }
                        if (this.message.contentType) {
                            this.message.headers.set('Content-Type', this.message.contentType);
                        }
                        _i = 0, _a = this._onSend;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        callback = _a[_i];
                        return [4 /*yield*/, Promise.resolve(callback(this.message))];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        init = {
                            method: this.message.method,
                            body: this.message.content,
                            headers: this.message.headers,
                            mode: this.message.mode
                        };
                        if (abortSignal || this.timeout) {
                            outerController = new AbortController();
                            if (abortSignal) {
                                abortSignal.addEventListener("abort", function () {
                                    outerController.abort();
                                });
                            }
                            init.signal = outerController.signal;
                        }
                        fetchResponsePromise = this.fetch(this.message.url, init);
                        if (!this.timeout) return [3 /*break*/, 6];
                        return [4 /*yield*/, Promise.race([
                                fetchResponsePromise,
                                new Promise(function (_, reject) { return setTimeout(function () {
                                    outerController.abort();
                                    reject(new timeout_error_1.TimeoutError());
                                }, _this.timeout); })
                            ])];
                    case 5:
                        fetchResponse = _d.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, fetchResponsePromise];
                    case 7:
                        fetchResponse = _d.sent();
                        _d.label = 8;
                    case 8:
                        httpResponse = new http_response_1.HttpResponse(fetchResponse);
                        if (this._ensureSuccessStatusCode) {
                            httpResponse.ensureSuccessfulStatusCode();
                        }
                        _b = 0, _c = this._onSent;
                        _d.label = 9;
                    case 9:
                        if (!(_b < _c.length)) return [3 /*break*/, 12];
                        callback = _c[_b];
                        return [4 /*yield*/, Promise.resolve(callback(httpResponse))];
                    case 10:
                        _d.sent();
                        _d.label = 11;
                    case 11:
                        _b++;
                        return [3 /*break*/, 9];
                    case 12: return [2 /*return*/, httpResponse];
                }
            });
        });
    };
    HttpBuilder.prototype.ensureSuccessStatusCode = function (ensureSuccessStatusCode) {
        this._ensureSuccessStatusCode = ensureSuccessStatusCode === false ? false : true;
        return this;
    };
    HttpBuilder.prototype.use = function (settings) {
        if (settings.fetch) {
            this.useFetch(settings.fetch);
        }
        if (settings.corsMode) {
            this.useCors(settings.corsMode);
        }
        if (settings.baseUrl) {
            this.useBaseUrl(settings.baseUrl);
        }
        return this;
    };
    HttpBuilder.prototype.useFetch = function (fetch) {
        this.fetch = fetch;
        return this;
    };
    HttpBuilder.prototype.useCors = function (mode) {
        this.message.mode = mode;
        return this;
    };
    HttpBuilder.prototype.useBaseUrl = function (baseUrl) {
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.substr(0, baseUrl.length - 1);
        }
        if (this.message.url.startsWith('/')) {
            this.message.url = baseUrl + this.message.url;
        }
        else {
            this.message.url = baseUrl + '/' + this.message.url;
        }
        return this;
    };
    HttpBuilder.prototype.useTimeout = function (timeout) {
        this.timeout = timeout || undefined;
        return this;
    };
    // Content Extensions
    HttpBuilder.prototype.with = function (content, contentType) {
        this.message.content = content;
        this.message.contentType = contentType;
        return this;
    };
    HttpBuilder.prototype.withForm = function (content) {
        this.message.content = content;
        this.message.contentType = undefined;
        return this;
    };
    HttpBuilder.prototype.withJson = function (content) {
        this.message.content = ur_json_1.serialize(content);
        this.message.contentType = 'application/json';
        return this;
    };
    HttpBuilder.prototype.withJsonPatch = function (operations) {
        this.message.content = ur_json_1.serialize(operations);
        this.message.contentType = 'application/json-patch+json';
        return this;
    };
    // Modifier Extensions
    HttpBuilder.prototype.addHeader = function (name, value) {
        this.message.headers.append(name, value);
        return this;
    };
    // Expect Extensions
    HttpBuilder.prototype.expectString = function () {
        return this.useHandler(function (response) {
            return response.text();
        });
    };
    HttpBuilder.prototype.expectBinary = function () {
        return this.useHandler(function (response) {
            return response.arrayBuffer();
        });
    };
    HttpBuilder.prototype.expectJson = function (typeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(function (response) {
            return response.json().then(function (x) { return jsonFactory.getModelFactory(typeCtorOrFactory)(x); });
        });
    };
    HttpBuilder.prototype.expectJsonArray = function (itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(function (response) {
            return response.json().then(function (x) {
                var itemFactory = jsonFactory.getModelFactory(itemTypeCtorOrFactory);
                return x.map(itemFactory);
            });
        });
    };
    HttpBuilder.prototype.expectJsonNullableArray = function (itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(function (response) {
            return response.json().then(function (x) {
                var itemFactory = jsonFactory.getNullableModelFactory(itemTypeCtorOrFactory);
                return x.map(itemFactory);
            });
        });
    };
    HttpBuilder.prototype.expectJsonPaginationResult = function (itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(function (response) {
            return response.json().then(function (x) {
                var itemFactory = jsonFactory.getModelFactory(itemTypeCtorOrFactory);
                return {
                    meta: {
                        pageCount: x.meta.pageCount,
                        pageSize: x.meta.pageSize,
                        totalItems: x.meta.totalItems
                    },
                    data: x.data.map(itemFactory)
                };
            });
        });
    };
    HttpBuilder.prototype.expectJsonInfinitePaginationResult = function (itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(function (response) {
            return response.json().then(function (x) {
                var itemFactory = jsonFactory.getModelFactory(itemTypeCtorOrFactory);
                return {
                    meta: {
                        pageSize: x.meta.pageSize,
                        continuationToken: x.meta.continuationToken
                    },
                    data: x.data.map(itemFactory)
                };
            });
        });
    };
    HttpBuilder.prototype.expectMessagePackArray = function (itemTypeCtorOrFactory) {
        var _this = this;
        this.message.headers.set('Accept', 'application/x-msgpack');
        return this.useHandler(function (response) { return __awaiter(_this, void 0, void 0, function () {
            var items, msgpack, msgpackFactory, itemFactory, _a, _b, item, e_1_1;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        items = [];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("@msgpack/msgpack"); })];
                    case 1:
                        msgpack = _d.sent();
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./msgpack"); })];
                    case 2:
                        msgpackFactory = _d.sent();
                        itemFactory = msgpackFactory.getModelFactory(itemTypeCtorOrFactory);
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 8, 9, 14]);
                        _a = __asyncValues(msgpack.decodeArrayStream(response.body));
                        _d.label = 4;
                    case 4: return [4 /*yield*/, _a.next()];
                    case 5:
                        if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 7];
                        item = _b.value;
                        items.push(itemFactory(item));
                        _d.label = 6;
                    case 6: return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 14];
                    case 8:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 14];
                    case 9:
                        _d.trys.push([9, , 12, 13]);
                        if (!(_b && !_b.done && (_c = _a.return))) return [3 /*break*/, 11];
                        return [4 /*yield*/, _c.call(_a)];
                    case 10:
                        _d.sent();
                        _d.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 13: return [7 /*endfinally*/];
                    case 14: return [2 /*return*/, items];
                }
            });
        }); });
    };
    HttpBuilder.prototype.streamMessagePackArray = function (itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/x-msgpack');
        function handler(response) {
            return __asyncGenerator(this, arguments, function handler_1() {
                var msgpack, msgpackFactory, itemFactory, _a, _b, item, e_2_1;
                var e_2, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, __await(Promise.resolve().then(function () { return require("@msgpack/msgpack"); }))];
                        case 1:
                            msgpack = _d.sent();
                            return [4 /*yield*/, __await(Promise.resolve().then(function () { return require("./msgpack"); }))];
                        case 2:
                            msgpackFactory = _d.sent();
                            itemFactory = msgpackFactory.getModelFactory(itemTypeCtorOrFactory);
                            _d.label = 3;
                        case 3:
                            _d.trys.push([3, 10, 11, 16]);
                            _a = __asyncValues(msgpack.decodeArrayStream(response.body));
                            _d.label = 4;
                        case 4: return [4 /*yield*/, __await(_a.next())];
                        case 5:
                            if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 9];
                            item = _b.value;
                            return [4 /*yield*/, __await(itemFactory(item))];
                        case 6: return [4 /*yield*/, _d.sent()];
                        case 7:
                            _d.sent();
                            _d.label = 8;
                        case 8: return [3 /*break*/, 4];
                        case 9: return [3 /*break*/, 16];
                        case 10:
                            e_2_1 = _d.sent();
                            e_2 = { error: e_2_1 };
                            return [3 /*break*/, 16];
                        case 11:
                            _d.trys.push([11, , 14, 15]);
                            if (!(_b && !_b.done && (_c = _a.return))) return [3 /*break*/, 13];
                            return [4 /*yield*/, __await(_c.call(_a))];
                        case 12:
                            _d.sent();
                            _d.label = 13;
                        case 13: return [3 /*break*/, 15];
                        case 14:
                            if (e_2) throw e_2.error;
                            return [7 /*endfinally*/];
                        case 15: return [7 /*endfinally*/];
                        case 16: return [2 /*return*/];
                    }
                });
            });
        }
        return this.useHandler(function (response) { return Promise.resolve(handler(response)); });
    };
    return HttpBuilder;
}());
exports.HttpBuilder = HttpBuilder;
var HttpBuilderOfT = /** @class */ (function (_super) {
    __extends(HttpBuilderOfT, _super);
    function HttpBuilderOfT(inner, handler) {
        var _this = _super.call(this, inner.message, inner.fetch) || this;
        _this.inner = inner;
        _this.handler = handler;
        _this._onReceived = [];
        return _this;
    }
    HttpBuilderOfT.prototype.onSend = function (callback) {
        this.inner.onSend(callback);
        return this;
    };
    HttpBuilderOfT.prototype.onSent = function (callback) {
        this.inner.onSent(callback);
        return this;
    };
    HttpBuilderOfT.prototype.ensureSuccessStatusCode = function (ensureSuccessStatusCode) {
        this.inner.ensureSuccessStatusCode(ensureSuccessStatusCode);
        return this;
    };
    HttpBuilderOfT.prototype.use = function (settings) {
        this.inner.use(settings);
        return this;
    };
    HttpBuilderOfT.prototype.useFetch = function (fetch) {
        this.inner.useFetch(fetch);
        return this;
    };
    HttpBuilderOfT.prototype.useCors = function (mode) {
        this.inner.useCors(mode);
        return this;
    };
    HttpBuilderOfT.prototype.useBaseUrl = function (baseUrl) {
        this.inner.useBaseUrl(baseUrl);
        return this;
    };
    HttpBuilderOfT.prototype.useTimeout = function (timeout) {
        this.inner.useTimeout(timeout);
        return this;
    };
    HttpBuilderOfT.prototype.allowEmptyResponse = function () {
        var _this = this;
        if (this._onReceived.length) {
            throw new Error("onReceived() should only be called after allowEmptyResponse()");
        }
        return new HttpBuilderOfT(this.inner, function (response) {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return _this.handler(response);
        });
    };
    HttpBuilderOfT.prototype.onReceived = function (callback) {
        this._onReceived.push(callback);
        return this;
    };
    HttpBuilderOfT.prototype.send = function (abortSignal) {
        var _this = this;
        var responsePromise = this.inner.send(abortSignal).then(function (x) { return new http_response_1.HttpResponseOfT(x.rawResponse, _this.handler); });
        return asSendPromise(responsePromise, function () { return responsePromise.then(function (response) { return _this.handleReceive(response); }); });
    };
    HttpBuilderOfT.prototype.transfer = function (abortSignal) {
        var _this = this;
        return this.send(abortSignal).then(function (response) { return _this.handleReceive(response); });
    };
    HttpBuilderOfT.prototype.handleReceive = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var received, _i, _a, callback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, response.receive()];
                    case 1:
                        received = _b.sent();
                        _i = 0, _a = this._onReceived;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        callback = _a[_i];
                        return [4 /*yield*/, Promise.resolve(callback(received, response))];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, received];
                }
            });
        });
    };
    return HttpBuilderOfT;
}(HttpBuilder));
exports.HttpBuilderOfT = HttpBuilderOfT;
function asSendPromise(responsePromise, thenReceive) {
    responsePromise.thenReceive = thenReceive;
    return responsePromise;
}
//# sourceMappingURL=http-builder.js.map