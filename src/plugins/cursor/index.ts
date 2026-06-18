import { HttpBuilder, TypeOrMapper, getMapper } from "@utiliread/http";
import { deserialize } from "@utiliread/json";
import type { ICursorPage } from "./cursor-page";

export type { ICursorPage };
export {
  CursorPaginator,
  type CursorPaginatorFromBuilderOptions,
} from "./cursor-pageable";

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare module "@utiliread/http" {
  interface HttpBuilder {
    /**
     * Configures the request to expect a cursor-paginated JSON response and deserialises
     * each item using the provided type or mapper function.
     *
     * Sets the `Accept: application/json` request header automatically.
     *
     * @param typeOrMapper - A class constructor or a mapping function used to deserialise
     *                       each item in the page.
     * @returns A builder that resolves to an {@link ICursorPage}\<T\>.
     *
     * @example
     * ```ts
     * const page = await http.get("/api/orders")
     *   .expectCursorPage(Order);
     *
     * // Wrap in CursorPageable to iterate all pages:
     * const all = await CursorPageable.fromBuilder(
     *   http.get("/api/orders").expectCursorPage(Order)
     * ).toArray();
     * ```
     */
    expectCursorPage<T>(
      typeOrMapper: TypeOrMapper<T>,
    ): HttpBuilderOfT<ICursorPage<T>>;
  }
}

HttpBuilder.prototype.expectCursorPage = function <T>(
  this: HttpBuilder,
  typeOrMapper: TypeOrMapper<T>,
) {
  this.message.headers.set("Accept", "application/json");
  return this.useHandler((response) => {
    const promise = response.rawResponse
      .json()
      .then((x: ICursorPage<any>): ICursorPage<T> => {
        const itemFactory = getMapper(deserialize, typeOrMapper);
        return {
          items: x.items.map(itemFactory),
          nextCursor: x.nextCursor,
          hasMore: x.hasMore,
          totalCount: x.totalCount,
        };
      });
    return promise;
  });
};
