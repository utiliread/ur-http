"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
var http_response_1 = require("./http-response");
var ur_json_1 = require("ur-json");
var timeout_error_1 = require("./timeout-error");
var HttpBuilder = /** @class */ (function () {
    function HttpBuilder(message, fetch, timeout) {
        this.message = message;
        this.fetch = fetch;
        this.timeout = timeout;
        this._ensureSuccessStatusCode = true;
        this._onSent = [];
    }
    HttpBuilder.create = function (method, url) {
        return new HttpBuilder({
            method: method,
            url: url,
            headers: new Headers()
        }, http_1.Http.defaults.fetch, http_1.Http.defaults.timeout);
    };
    HttpBuilder.prototype.using = function (fetch) {
        this.fetch = fetch;
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
            var init, outerController, fetchResponsePromise, fetchResponse, httpResponse, _i, _a, callback;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.fetch) {
                            throw Error('fetch() is not properly configured');
                        }
                        if (this.message.contentType) {
                            this.message.headers.set('Content-Type', this.message.contentType);
                        }
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
                        if (!this.timeout) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.race([
                                fetchResponsePromise,
                                new Promise(function (_, reject) { return setTimeout(function () {
                                    outerController.abort();
                                    reject(new timeout_error_1.TimeoutError());
                                }, _this.timeout); })
                            ])];
                    case 1:
                        fetchResponse = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, fetchResponsePromise];
                    case 3:
                        fetchResponse = _b.sent();
                        _b.label = 4;
                    case 4:
                        httpResponse = new http_response_1.HttpResponse(fetchResponse);
                        if (this._ensureSuccessStatusCode) {
                            httpResponse.ensureSuccessfulStatusCode();
                        }
                        _i = 0, _a = this._onSent;
                        _b.label = 5;
                    case 5:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        callback = _a[_i];
                        return [4 /*yield*/, Promise.resolve(callback(httpResponse))];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/, httpResponse];
                }
            });
        });
    };
    HttpBuilder.prototype.ensureSuccessStatusCode = function (ensureSuccessStatusCode) {
        this._ensureSuccessStatusCode = ensureSuccessStatusCode === false ? false : true;
        return this;
    };
    HttpBuilder.prototype.hasTimeout = function (timeout) {
        this.timeout = timeout;
        return this;
    };
    HttpBuilder.prototype.useCors = function (mode) {
        this.message.mode = mode;
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
            return response.json().then(function (x) { return getJsonModelFactory(typeCtorOrFactory)(x); });
        });
    };
    HttpBuilder.prototype.expectJsonArray = function (itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(function (response) {
            return response.json().then(function (x) {
                var itemFactory = getJsonModelFactory(itemTypeCtorOrFactory);
                return x.map(itemFactory);
            });
        });
    };
    HttpBuilder.prototype.expectJsonNullableArray = function (itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(function (response) {
            return response.json().then(function (x) {
                var itemFactory = getJsonNullableModelFactory(itemTypeCtorOrFactory);
                return x.map(itemFactory);
            });
        });
    };
    HttpBuilder.prototype.expectJsonPaginationResult = function (itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(function (response) {
            return response.json().then(function (x) {
                var itemFactory = getJsonModelFactory(itemTypeCtorOrFactory);
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
                var itemFactory = getJsonModelFactory(itemTypeCtorOrFactory);
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
    HttpBuilderOfT.prototype.onSent = function (callback) {
        this.inner.onSent(callback);
        return this;
    };
    HttpBuilderOfT.prototype.ensureSuccessStatusCode = function (ensureSuccessStatusCode) {
        this.inner.ensureSuccessStatusCode(ensureSuccessStatusCode);
        return this;
    };
    HttpBuilderOfT.prototype.hasTimeout = function (timeout) {
        this.inner.timeout = timeout;
        return this;
    };
    HttpBuilderOfT.prototype.allowEmptyResponse = function () {
        var _this = this;
        return this.useHandler(function (response) {
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
function getJsonNullableModelFactory(typeCtorOrFactory) {
    if (!typeCtorOrFactory) {
        return function (x) { return x; };
    }
    if (isZeroArgumentFunction(typeCtorOrFactory)) {
        // It cannot be a factory function if it takes no arguments,
        // so it must be a (zero argument) type (constructor)
        return function (x) {
            var bound = ur_json_1.modelBind(typeCtorOrFactory, x);
            // The server cannot produce the undefined result
            if (bound === undefined) {
                throw Error("The model factory created a undefined result");
            }
            return bound;
        };
    }
    return typeCtorOrFactory;
}
function getJsonModelFactory(typeCtorOrFactory) {
    var factory = getJsonNullableModelFactory(typeCtorOrFactory);
    return function (x) {
        var result = factory(x);
        if (result === null) {
            throw Error("The model factory created a null result");
        }
        return result;
    };
}
function isZeroArgumentFunction(typeCtor) {
    return typeCtor.length === 0;
}
//# sourceMappingURL=http-builder.js.map