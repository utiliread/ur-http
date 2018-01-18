'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var urJson = require('ur-json');
var luxon = require('luxon');

function isEmptyTypeCtor(typeCtor) {
    return typeCtor.length === 0;
}

function paginationFactory(itemTypeCtorOrFactory, source) {
    const itemFactory = isEmptyTypeCtor(itemTypeCtorOrFactory)
        ? (x) => urJson.deserialize(itemTypeCtorOrFactory, x)
        : itemTypeCtorOrFactory;
    return {
        meta: {
            pageCount: source.meta.pageCount,
            pageSize: source.meta.pageSize,
            totalItems: source.meta.totalItems
        },
        data: source.data.map(itemFactory)
    };
}

class HttpResponse {
    constructor(rawResponse) {
        this.rawResponse = rawResponse;
    }
}

class HttpResponseOfT extends HttpResponse {
    constructor(rawResponse, handler) {
        super(rawResponse);
        this.handler = handler;
    }
    receive() {
        return this.handler(this.rawResponse);
    }
}

class HttpBuilderOfT {
    constructor(inner, handler) {
        this.inner = inner;
        this.handler = handler;
    }
    send(abortSignal) {
        let responsePromise = this.inner.send(abortSignal).then(x => new HttpResponseOfT(x.rawResponse, this.handler));
        return asSendPromise(responsePromise, () => responsePromise.then(response => response.receive()));
    }
    transfer(abortSignal) {
        return this.send(abortSignal).thenReceive();
    }
}
function asSendPromise(responsePromise, thenReceive) {
    responsePromise.thenReceive = thenReceive;
    return responsePromise;
}

class HttpBuilder {
    constructor(method, url) {
        this.fetch = HttpBuilder.defaultFetch;
        this.message = {
            method: method,
            url: url,
            headers: new Headers()
        };
    }
    using(fetch) {
        this.fetch = fetch;
        return this;
    }
    useHandler(handler) {
        return new HttpBuilderOfT(this, handler);
    }
    async send(abortSignal) {
        if (this.message.contentType) {
            this.message.headers.set('Content-Type', this.message.contentType);
        }
        // Cast to any to allow for the signal property
        let response = await this.fetch(this.message.url, {
            method: this.message.method,
            body: this.message.content,
            headers: this.message.headers,
            signal: abortSignal
        });
        return new HttpResponse(response);
    }
    // Content Extensions
    withForm(content) {
        this.message.content = content;
        this.message.contentType = undefined;
        return this;
    }
    withJson(content) {
        this.message.content = JSON.stringify(content);
        this.message.contentType = 'application/json';
        return this;
    }
    // Modifier Extensions
    addHeader(name, value) {
        this.message.headers.append(name, value);
        return this;
    }
    // Expect Extensions
    expectJson(typeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return response.json().then(x => {
                if (!typeCtorOrFactory) {
                    return x;
                }
                const factory = isEmptyTypeCtor(typeCtorOrFactory)
                    ? (x) => urJson.deserialize(typeCtorOrFactory, x)
                    : typeCtorOrFactory;
                return factory(x);
            });
        });
    }
    expectJsonArray(itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return response.json().then((x) => {
                const itemFactory = isEmptyTypeCtor(itemTypeCtorOrFactory)
                    ? (x) => urJson.deserialize(itemTypeCtorOrFactory, x)
                    : itemTypeCtorOrFactory;
                return x.map(itemFactory);
            });
        });
    }
    expectJsonPaginationResult(itemTypeCtorOrFactory) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return response.json().then(x => paginationFactory(itemTypeCtorOrFactory, x));
        });
    }
}
HttpBuilder.defaultFetch = fetch;

class QueryString {
    static serialize(params) {
        if (!params) {
            return '';
        }
        return '?' + this._serializeQueryString(params);
    }
    static getParameter(name) {
        let regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
        let match = regex.exec(window.location.href);
        if (match) {
            if (match[1].length > 0) {
                return decodeURIComponent(match[2]);
            }
            else {
                return null;
            }
        }
    }
    static _serializeQueryString(source, prefix) {
        let parts = [];
        for (let propertyName in source) {
            if (source.hasOwnProperty(propertyName)) {
                let key = prefix != null
                    ? prefix + (Array.isArray(source)
                        ? '[' + propertyName + ']'
                        : '.' + propertyName)
                    : propertyName;
                let value = source[propertyName];
                if (value instanceof luxon.DateTime) {
                    parts.push(encodeURIComponent(key) + '=' + value.toISO());
                }
                else if (typeof value === 'object') {
                    parts.push(this._serializeQueryString(value, key));
                }
                else if (value) {
                    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                }
            }
        }
        return parts.join('&');
    }
}

class Http {
    static request(method, url, params) {
        return new HttpBuilder(method, url + QueryString.serialize(params));
    }
    static post(url, params) {
        return Http.request('POST', url, params);
    }
    static get(url, params) {
        return Http.request('GET', url, params);
    }
    static put(url, params) {
        return Http.request('PUT', url, params);
    }
    static patch(url, params) {
        return Http.request('PATCH', url, params);
    }
    static delete(url, params) {
        return Http.request('DELETE', url, params);
    }
}

exports.Http = Http;
exports.paginationFactory = paginationFactory;
exports.QueryString = QueryString;
exports.HttpResponseOfT = HttpResponseOfT;
exports.HttpResponse = HttpResponse;
