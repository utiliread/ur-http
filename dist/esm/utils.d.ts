export declare function isEmptyTypeCtor<T>(typeCtor: Function): typeCtor is {
    new (): T;
};
