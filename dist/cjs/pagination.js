"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ur_json_1 = require("ur-json");
const utils_1 = require("./utils");
function paginationFactory(itemTypeCtorOrFactory, source) {
    const itemFactory = utils_1.isEmptyTypeCtor(itemTypeCtorOrFactory)
        ? (x) => ur_json_1.deserialize(itemTypeCtorOrFactory, x)
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
exports.paginationFactory = paginationFactory;
//# sourceMappingURL=pagination.js.map