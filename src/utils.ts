export function isClass<T>(itemTypeOrFactory: { new (): T } | ((item: any) => T)): itemTypeOrFactory is { new (): T } {
    return typeof itemTypeOrFactory === 'function' && /^\s*class\s+/.test(itemTypeOrFactory.toString());
}