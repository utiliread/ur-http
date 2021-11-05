type DeserializeFn<T> = (type: Type<T>, source: any) => T | null | undefined;
export type Type<T> = { new(): T };
export type Mapper<T> = ((source: any) => T);

export function getNullableMapper<T>(deserialize: DeserializeFn<T>, typeOrMap: Type<T> | Mapper<T> | undefined): Mapper<T | null> {
    if (!typeOrMap) {
        return (x: any) => <T>x;
    }

    if (isZeroArgumentFunction(typeOrMap)) {
        // It cannot be a factory function if it takes no arguments,
        // so it must be a (zero argument) type (constructor)
        return (x: any) => {
            const bound = deserialize(typeOrMap, x);

            // The server cannot produce the undefined result
            if (bound === undefined) {
                throw Error("The model factory created a undefined result");
            }

            return bound;
        }
    }

    return typeOrMap;
}

export function getMapper<T>(deserialize: DeserializeFn<T>, typeOrMap: Type<T> | Mapper<T> | undefined): Mapper<T> {
    const nullableFactory = getNullableMapper(deserialize, typeOrMap);
    return (x: any) => {
        const result = nullableFactory(x);

        if (result === null) {
            throw Error("The model factory created a null result");
        }

        return result;
    };
}

function isZeroArgumentFunction<T>(typeCtor: Function): typeCtor is { new(): T } {
    return typeCtor.length === 0;
}