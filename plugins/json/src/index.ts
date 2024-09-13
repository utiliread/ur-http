import {
  HttpBuilder,
  HttpBuilderOfT,
  InfinitePaginationResult,
  PaginationResult,
  TypeOrMapper,
  getMapper,
  getNullableMapper,
} from "@utiliread/http";
import { deserialize, serialize } from "@utiliread/json";

// Force declarations to be module augmentations instead of ambient module declarations
// https://www.typescriptlang.org/docs/handbook/modules/reference.html#ambient-modules
export default {};

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare module "@utiliread/http" {
  interface HttpBuilder {
    withJson(content: any): this;

    expectJson<T>(
      typeOrMapper?: TypeOrMapper<T>
    ): HttpBuilderOfT<T>;
    expectJsonArray<T>(
      typeOrMapper: TypeOrMapper<T>
    ): HttpBuilderOfT<T[]>;
    expectJsonNullableArray<T>(
      typeOrMapper: TypeOrMapper<T>
    ): HttpBuilderOfT<(T | null)[]>;
    expectJsonPaginationResult<T>(
      typeOrMapper: TypeOrMapper<T>
    ): HttpBuilderOfT<PaginationResult<T>>;
    expectJsonInfinitePaginationResult<T>(
      typeOrMapper: TypeOrMapper<T>
    ): HttpBuilderOfT<InfinitePaginationResult<T>>;
  }

  interface HttpBuilderOfT<T> {
    withJson(content: any): this;
  }
}

HttpBuilder.prototype.withJson = function (this: HttpBuilder, content: any) {
  this.message.content = serialize(content);
  this.message.contentType = "application/json";
  return this;
};

HttpBuilderOfT.prototype.withJson = function <T>(
  this: HttpBuilderOfT<T>,
  content: any
) {
  this.message.content = serialize(content);
  this.message.contentType = "application/json";
  return this;
};

HttpBuilder.prototype.expectJson = function <T>(
  this: HttpBuilder,
  typeOrMapper?: TypeOrMapper<T>
) {
  this.message.headers.set("Accept", "application/json");
  return this.useHandler((response) => {
    const promise = response.rawResponse
      .json()
      .then((x) => getMapper(deserialize, typeOrMapper)(x));
    return promise;
  });
};

HttpBuilder.prototype.expectJsonArray = function <T>(
  this: HttpBuilder,
  typeOrMapper: TypeOrMapper<T>
) {
  this.message.headers.set("Accept", "application/json");
  return this.useHandler((response) => {
    const promise = response.rawResponse.json().then((x: any[]) => {
      const itemFactory = getMapper(deserialize, typeOrMapper);
      return x.map(itemFactory);
    });
    return promise;
  });
};

HttpBuilder.prototype.expectJsonNullableArray = function <T>(
  this: HttpBuilder,
  typeOrMapper: TypeOrMapper<T>
): HttpBuilderOfT<(T | null)[]> {
  this.message.headers.set("Accept", "application/json");
  return this.useHandler((response) => {
    const promise = response.rawResponse.json().then((x: any[]) => {
      const itemFactory = getNullableMapper(deserialize, typeOrMapper);
      return x.map(itemFactory);
    });
    return promise;
  });
};

HttpBuilder.prototype.expectJsonPaginationResult = function <T>(
  this: HttpBuilder,
  typeOrMapper: TypeOrMapper<T>
) {
  this.message.headers.set("Accept", "application/json");
  return this.useHandler((response) => {
    const promise = response.rawResponse
      .json()
      .then((x: PaginationResult<any>) => {
        const itemFactory = getMapper(deserialize, typeOrMapper);
        return {
          meta: {
            pageCount: x.meta.pageCount,
            pageSize: x.meta.pageSize,
            totalItems: x.meta.totalItems,
          },
          data: x.data.map(itemFactory),
        };
      });
    return promise;
  });
};

HttpBuilder.prototype.expectJsonInfinitePaginationResult = function <T>(
  this: HttpBuilder,
  typeOrMapper: TypeOrMapper<T>
) {
  this.message.headers.set("Accept", "application/json");
  return this.useHandler((response) => {
    const promise = response.rawResponse
      .json()
      .then((x: InfinitePaginationResult<any>) => {
        const itemFactory = getMapper(deserialize, typeOrMapper);
        return {
          meta: {
            pageSize: x.meta.pageSize,
            continuationToken: x.meta.continuationToken,
          },
          data: x.data.map(itemFactory),
        };
      });
    return promise;
  });
};
