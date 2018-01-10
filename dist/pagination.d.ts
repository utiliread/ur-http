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
export declare function paginationFactory<T>(itemTypeCtorOrFactory: {
    new (): T;
} | ((item: any) => T), source: PaginationResult<any>): PaginationResult<T | null>;
