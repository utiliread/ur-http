export function isEmptyTypeCtor<T>(typeCtor: Function): typeCtor is { new (): T } {
    return typeCtor.length === 0;
}