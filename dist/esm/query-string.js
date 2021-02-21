import { DateTime } from "luxon";
export class QueryString {
    static serialize(params) {
        if (!params) {
            return "";
        }
        const serialized = this._serializeQueryString(params);
        if (!serialized.length) {
            return "";
        }
        return "?" + serialized;
    }
    static append(url, params) {
        if (!params) {
            return url;
        }
        const any = url.indexOf("?") >= 0;
        const separator = any ? "&" : "?";
        return url + separator + this._serializeQueryString(params);
    }
    static getParameter(name) {
        const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
        const match = regex.exec(window.location.href);
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
        const parts = [];
        for (const propertyName in source) {
            if (source.hasOwnProperty(propertyName)) {
                const key = prefix != null
                    ? prefix + (Array.isArray(source)
                        ? "[" + encodeURIComponent(propertyName) + "]"
                        : "." + encodeURIComponent(propertyName))
                    : encodeURIComponent(propertyName);
                const value = source[propertyName];
                if (value instanceof DateTime) {
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
    }
}
//# sourceMappingURL=query-string.js.map