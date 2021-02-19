export function isZeroArgumentFunction<T>(typeCtor: Function): typeCtor is { new(): T } {
    return typeCtor.length === 0;
}