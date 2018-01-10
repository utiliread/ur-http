import { deserialize } from 'ur-json';
import { isEmptyTypeCtor } from './utils';

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

export function paginationFactory<T>(itemTypeCtorOrFactory: { new (): T } | ((item: any) => T), source: PaginationResult<any>): PaginationResult<T | null> {
    const itemFactory = isEmptyTypeCtor(itemTypeCtorOrFactory)
        ? (x: any) => deserialize(itemTypeCtorOrFactory, x)
        : itemTypeCtorOrFactory;
    
    return {
        meta: {
            pageCount: source.meta.pageCount,
            pageSize: source.meta.pageSize,
            totalItems: source.meta.totalItems
        },
        data: source.data.map(itemFactory)
    };
}