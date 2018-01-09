export function isClass(itemTypeOrFactory) {
    return typeof itemTypeOrFactory === 'function' && /^\s*class\s+/.test(itemTypeOrFactory.toString());
}
