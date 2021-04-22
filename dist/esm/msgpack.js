import { deserialize } from "ur-msgpack";
import { isZeroArgumentFunction } from "./utils";
export function getNullableModelFactory(typeCtorOrFactory) {
    if (!typeCtorOrFactory) {
        return function (x) { return x; };
    }
    if (isZeroArgumentFunction(typeCtorOrFactory)) {
        // It cannot be a factory function if it takes no arguments,
        // so it must be a (zero argument) type (constructor)
        return function (x) {
            var bound = deserialize(typeCtorOrFactory, x);
            // The server cannot produce the undefined result
            if (bound === undefined) {
                throw Error("The model factory created a undefined result");
            }
            return bound;
        };
    }
    return typeCtorOrFactory;
}
export function getModelFactory(typeCtorOrFactory) {
    var factory = getNullableModelFactory(typeCtorOrFactory);
    return function (x) {
        var result = factory(x);
        if (result === null) {
            throw Error("The model factory created a null result");
        }
        return result;
    };
}
//# sourceMappingURL=msgpack.js.map