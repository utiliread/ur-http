export declare function isClass<T>(itemTypeOrFactory: {
    new (): T;
} | ((item: any) => T)): itemTypeOrFactory is {
    new (): T;
};
