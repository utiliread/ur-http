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
export interface InfinitePage {
    continuationToken?: string;
    size: number;
}
export interface InfinitePaginationResult<T> {
    meta: {
        pageSize: number;
        continuationToken: string | null;
    };
    data: T[];
}
