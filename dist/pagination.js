import { deserialize } from 'ur-json';
import { extend } from 'lodash-es';
import { isEmptyTypeCtor } from './utils';
export function paginationFactory(itemTypeCtorOrFactory, source) {
    const itemFactory = isEmptyTypeCtor(itemTypeCtorOrFactory)
        ? (x) => deserialize(itemTypeCtorOrFactory, x)
        : itemTypeCtorOrFactory;
    return extend(source, {
        data: source.data.map(itemFactory)
    });
}
