export interface Page {
    number: number;
    size: number;
}
export interface PaginationResult<T> {
    meta: {
        pageCount: number;
        pageSize: number;
        totalItems: number;
    };
    data: T[];
}
export declare function paginationFactory<T>(itemTypeOrFactory: {
    new (): T;
} | ((item: any) => T), source: any): PaginationResult<T>;
