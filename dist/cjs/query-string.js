"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
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
                if (value instanceof luxon_1.DateTime) {
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
exports.QueryString = QueryString;
//# sourceMappingURL=query-string.js.map