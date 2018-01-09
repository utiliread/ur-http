import { deserialize } from 'ur-json';
import { extend } from 'lodash-es';
import { isClass } from './utils';

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

export function paginationFactory<T>(itemTypeOrFactory: { new (): T } | ((item: any) => T), source: any): PaginationResult<T> {
    const itemFactory = isClass(itemTypeOrFactory)
        ? (x: any) => deserialize(itemTypeOrFactory, x)
        : itemTypeOrFactory;
        
    return extend(source, {
        data: source.data.map(itemFactory)
    });
}