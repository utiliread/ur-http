declare type DeserializeFn<T> = (source: any, type: Type<T>) => T | null | undefined;
export declare type Type<T> = {
    new (): T;
};
export declare type Mapper<T> = ((source: any) => T);
export declare type TypeOrMapper<T> = Type<T> | Mapper<T>;
export declare function getNullableMapper<T>(deserialize: DeserializeFn<T>, typeOrMap: Type<T> | Mapper<T> | undefined): Mapper<T | null>;
export declare function getMapper<T>(deserialize: DeserializeFn<T>, typeOrMap: Type<T> | Mapper<T> | undefined): Mapper<T>;
export {};
