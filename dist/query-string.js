import { isMoment } from 'moment';
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
                        ? '[' + propertyName + ']'
                        : '.' + propertyName)
                    : propertyName;
                var value = source[propertyName];
                if (value !== undefined) {
                    if (isMoment(value)) {
                        parts.push(encodeURIComponent(key) + '=' + value.toISOString());
                    }
                    else if (typeof value === 'object') {
                        parts.push(this._serializeQueryString(value, key));
                    }
                    else if (value) {
                        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                    }
                }
            }
        }
        return parts.join('&');
    };
    return QueryString;
}());
export { QueryString };
