"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var luxon_1 = require("luxon");
var QueryString = /** @class */ (function () {
    function QueryString() {
    }
    QueryString.serialize = function (params) {
        if (!params) {
            return '';
        }
        return '?' + this._serializeQueryString(params);
    };
    QueryString.getParameter = function (name) {
        var regex = /[?&]${name}(=([^&#]*)|&|#|$)/;
        var match = regex.exec(window.location.href);
        if (match) {
            if (match[1].length > 0) {
                return decodeURIComponent(match[2]);
            }
            else {
                return null;
            }
        }
    };
    QueryString._serializeQueryString = function (source, prefix) {
        var parts = [];
        for (var propertyName in source) {
            if (source.hasOwnProperty(propertyName)) {
                var key = prefix != null
                    ? prefix + (Array.isArray(source)
                        ? '[' + encodeURIComponent(propertyName) + ']'
                        : '.' + encodeURIComponent(propertyName))
                    : encodeURIComponent(propertyName);
                var value = source[propertyName];
                if (value instanceof luxon_1.DateTime) {
                    parts.push(key + '=' + value.toISO());
                }
                else if (value !== null && value !== undefined) {
                    if (typeof value === 'object') {
                        parts.push(this._serializeQueryString(value, key));
                    }
                    else {
                        parts.push(key + '=' + encodeURIComponent(value));
                    }
                }
            }
        }
        return parts.join('&');
    };
    return QueryString;
}());
exports.QueryString = QueryString;
//# sourceMappingURL=query-string.js.map