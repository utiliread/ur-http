"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var luxon_1 = require("luxon");
var QueryString = /** @class */ (function () {
    function QueryString() {
    }
    QueryString.serialize = function (params) {
        if (!params) {
            return "";
        }
        var serialized = this._serializeQueryString(params);
        if (!serialized.length) {
            return "";
        }
        return "?" + serialized;
    };
    QueryString.append = function (url, params) {
        if (!params) {
            return url;
        }
        var any = url.indexOf("?") >= 0;
        var separator = any ? "&" : "?";
        return url + separator + this._serializeQueryString(params);
    };
    QueryString.getParameter = function (name) {
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
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
                        ? "[" + encodeURIComponent(propertyName) + "]"
                        : "." + encodeURIComponent(propertyName))
                    : encodeURIComponent(propertyName);
                var value = source[propertyName];
                if (value instanceof luxon_1.DateTime) {
                    parts.push(key + "=" + encodeURIComponent(value.toISO()));
                }
                else if (value === null) {
                    parts.push(key);
                }
                else if (value !== undefined) {
                    if (typeof value === "object") {
                        parts.push(this._serializeQueryString(value, key));
                    }
                    else {
                        parts.push(key + "=" + encodeURIComponent(value));
                    }
                }
            }
        }
        return parts.join("&");
    };
    return QueryString;
}());
exports.QueryString = QueryString;
//# sourceMappingURL=query-string.js.map