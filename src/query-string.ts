import { DateTime } from 'luxon';

export class QueryString {
    static serialize(params: any) {
        if (!params) {
            return '';
        }
        return '?' + this._serializeQueryString(params);
    }

    static getParameter(name: string) {
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

    private static _serializeQueryString(source: any, prefix?: string) {
        const parts: string[] = [];
        for (const propertyName in source) {
            if (source.hasOwnProperty(propertyName)) {
                const key = prefix != null
                    ? prefix + (
                        Array.isArray(source)
                            ? '[' + encodeURIComponent(propertyName) + ']'
                            : '.' + encodeURIComponent(propertyName)
                    )
                    : encodeURIComponent(propertyName);
                const value = source[propertyName];

                if (value instanceof DateTime) {
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
    }
}