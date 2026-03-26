import {
  HttpBuilder,
  TypeOrMapper,
  getMapper,
} from "@utiliread/http";
import { deserialize } from "@utiliread/json";

export interface ICursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount?: number;
}

// Force declarations to be module augmentations instead of ambient module declarations
// https://www.typescriptlang.org/docs/handbook/modules/reference.html#ambient-modules
export default {};

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare module "@utiliread/http" {
  interface HttpBuilder {
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
