import { deserialize } from 'ur-json';
import { extend } from 'lodash-es';
import { isEmptyTypeCtor } from './utils';
export function paginationFactory(itemTypeOrFactory, source) {
    const itemFactory = isEmptyTypeCtor(itemTypeOrFactory)
        ? (x) => deserialize(itemTypeOrFactory, x)
        : itemTypeOrFactory;
    return extend(source, {
        data: source.data.map(itemFactory)
    });
}
