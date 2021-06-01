"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelFactory = exports.getNullableModelFactory = void 0;
var ur_json_1 = require("ur-json");
var utils_1 = require("./utils");
function getNullableModelFactory(typeCtorOrFactory) {
    if (!typeCtorOrFactory) {
        return function (x) { return x; };
    }
    if (utils_1.isZeroArgumentFunction(typeCtorOrFactory)) {
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
exports.getNullableModelFactory = getNullableModelFactory;
function getModelFactory(typeCtorOrFactory) {
    var factory = getNullableModelFactory(typeCtorOrFactory);
    return function (x) {
        var result = factory(x);
        if (result === null) {
            throw Error("The model factory created a null result");
        }
        return result;
    };
}
exports.getModelFactory = getModelFactory;
//# sourceMappingURL=json.js.map