import { deserialize } from 'ur-json';
import { extend } from 'lodash-es';
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

export function paginationFactory<T>(itemTypeCtorOrFactory: { new (): T } | ((item: any) => T), source: PaginationResult<any>): PaginationResult<T> {
    const itemFactory = isEmptyTypeCtor(itemTypeCtorOrFactory)
        ? (x: any) => deserialize(itemTypeCtorOrFactory, x)
        : itemTypeCtorOrFactory;
        
    return extend(source, {
        data: source.data.map(itemFactory)
    });
}