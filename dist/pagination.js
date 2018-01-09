import { deserialize } from 'ur-json';
import { extend } from 'lodash-es';
import { isClass } from './utils';
export function paginationFactory(itemTypeOrFactory, source) {
    const itemFactory = isClass(itemTypeOrFactory)
        ? (x) => deserialize(itemTypeOrFactory, x)
        : itemTypeOrFactory;
    return extend(source, {
        data: source.data.map(itemFactory)
    });
}
