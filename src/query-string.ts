import { DateTime, Duration } from "luxon";

export class QueryString {
  static serialize(params: any) {
    if (!params) {
      return "";
    }
    const serialized = this._serializeQueryString(params);
    if (!serialized.length) {
      return "";
    }
    return "?" + serialized;
  }

  static append(url: string, params: any) {
    if (!params) {
      return url;
    }
    const any = url.indexOf("?") >= 0;
    const separator = any ? "&" : "?";

    return url + separator + this._serializeQueryString(params);
  }

  static getParameter(name: string) {
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const match = regex.exec(window.location.href);
    if (match) {
      if (match[1].length > 0) {
        return decodeURIComponent(match[2]);
      } else {
        return null;
      }
    }
  }

  private static _serializeQueryString(source: any, prefix?: string) {
    const parts: string[] = [];
    for (const propertyName in source) {
      if (source.hasOwnProperty(propertyName)) {
        const key =
          prefix != null
            ? prefix +
              (Array.isArray(source)
                ? "[" + encodeURIComponent(propertyName) + "]"
                : "." + encodeURIComponent(propertyName))
            : encodeURIComponent(propertyName);
        const value = source[propertyName];

        if (value instanceof DateTime) {
          if (value.isValid) {
            parts.push(key + "=" + encodeURIComponent(value.toISO()!));
          }
        } else if (value instanceof Duration) {
          if (value.isValid) {
            parts.push(key + "=" + encodeURIComponent(value.toISO()!));
          }
        } else if (value === null) {
          parts.push(key);
        } else if (value !== undefined) {
          if ("function" === typeof value.toISOString) {
            parts.push(key + "=" + encodeURIComponent(value.toISOString()));
          }
          if (typeof value === "object") {
            parts.push(this._serializeQueryString(value, key));
          } else {
            parts.push(key + "=" + encodeURIComponent(value));
          }
        }
      }
    }

    return parts.join("&");
  }
}
