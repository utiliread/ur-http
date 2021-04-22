export declare function getNullableModelFactory<T>(typeCtorOrFactory: {
    new (): T;
} | ((object: any) => T) | undefined): (x: any) => T | null;
export declare function getModelFactory<T>(typeCtorOrFactory: {
    new (): T;
} | ((object: any) => T) | undefined): (x: any) => T;
