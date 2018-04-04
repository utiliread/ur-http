export interface Page {
    number: number;
    size: number;
}

export interface PaginationResult<T> {
    meta: {
        pageCount: number;
        pageSize: number;
        totalItems: number;
    },
    data: T[];
}