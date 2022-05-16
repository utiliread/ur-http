export function getNullableMapper(deserialize, typeOrMap) {
    if (!typeOrMap) {
        return (x) => x;
    }
    if (isZeroArgumentFunction(typeOrMap)) {
        // It cannot be a factory function if it takes no arguments,
        // so it must be a (zero argument) type (constructor)
        return (x) => {
            const bound = deserialize(x, typeOrMap);
            // The server cannot produce the undefined result
            if (bound === undefined) {
                throw Error("The model factory created a undefined result");
            }
            return bound;
        };
    }
    return typeOrMap;
}
export function getMapper(deserialize, typeOrMap) {
    const nullableFactory = getNullableMapper(deserialize, typeOrMap);
    return (x) => {
        const result = nullableFactory(x);
        if (result === null) {
            throw Error("The model factory created a null result");
        }
        return result;
    };
}
function isZeroArgumentFunction(typeCtor) {
    return typeCtor.length === 0;
}
//# sourceMappingURL=mapping.js.map