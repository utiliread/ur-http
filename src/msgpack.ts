import { deserialize } from "ur-msgpack";
import { isZeroArgumentFunction } from "./utils";
export { decodeArrayStream } from '@msgpack/msgpack';

export function getNullableModelFactory<T>(typeCtorOrFactory: { new(): T } | ((object: any) => T) | undefined) {
    if (!typeCtorOrFactory) {
        return (x: any) => <T>x;
    }

    if (isZeroArgumentFunction(typeCtorOrFactory)) {
        // It cannot be a factory function if it takes no arguments,
        // so it must be a (zero argument) type (constructor)
        return (x: any) => {
            const bound = deserialize(typeCtorOrFactory, x);

            // The server cannot produce the undefined result
            if (bound === undefined) {
                throw Error("The model factory created a undefined result");
            }

            return bound;
        }
    }

    return typeCtorOrFactory;
}

export function getModelFactory<T>(typeCtorOrFactory: { new(): T } | ((object: any) => T) | undefined) {
    const factory = getNullableModelFactory(typeCtorOrFactory);

    return (x: any) => {
        const result = factory(x);

        if (result === null) {
            throw Error("The model factory created a null result");
        }

        return result;
    };
}