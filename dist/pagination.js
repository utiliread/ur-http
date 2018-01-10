import { deserialize } from 'ur-json';
import { isEmptyTypeCtor } from './utils';
export function paginationFactory(itemTypeCtorOrFactory, source) {
    const itemFactory = isEmptyTypeCtor(itemTypeCtorOrFactory)
        ? (x) => deserialize(itemTypeCtorOrFactory, x)
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
