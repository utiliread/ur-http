import { HttpBuilder, HttpBuilderOfT, TypeOrMapper } from "@utiliread/http";
import type {
  InfinitePaginationResult,
  PaginationResult,
} from "../../../src/pagination";
import { deserialize, serialize } from "@utiliread/json";
import { getMapper, getNullableMapper } from "../../../src/mapping";

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare module "@utiliread/http" {
  interface HttpBuilder {
    withJson(content: any): this;

    expectJson<T>(typeOrMapper?: TypeOrMapper<T>): HttpBuilderOfT<T>;
    expectJsonArray<T>(typeOrMapper: TypeOrMapper<T>): HttpBuilderOfT<T[]>;
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
    return response.rawResponse
      .json()
      .then((x) => getMapper(deserialize, typeOrMapper)(x));
  });
};

HttpBuilder.prototype.expectJsonArray = function <T>(
  this: HttpBuilder,
  typeOrMapper: TypeOrMapper<T>
) {
  this.message.headers.set("Accept", "application/json");
  return this.useHandler((response) => {
    return response.rawResponse.json().then((x: any[]) => {
      const itemFactory = getMapper(deserialize, typeOrMapper);
      return x.map(itemFactory);
    });
  });
};

HttpBuilder.prototype.expectJsonNullableArray = function <T>(
  this: HttpBuilder,
  typeOrMapper: TypeOrMapper<T>
): HttpBuilderOfT<(T | null)[]> {
  this.message.headers.set("Accept", "application/json");
  return this.useHandler((response) => {
    return response.rawResponse.json().then((x: any[]) => {
      const itemFactory = getNullableMapper(deserialize, typeOrMapper);
      return x.map(itemFactory);
    });
  });
};

HttpBuilder.prototype.expectJsonPaginationResult = function <T>(
  this: HttpBuilder,
  typeOrMapper: TypeOrMapper<T>
) {
  this.message.headers.set("Accept", "application/json");
  return this.useHandler((response) => {
    return response.rawResponse.json().then((x: PaginationResult<any>) => {
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
  });
};

HttpBuilder.prototype.expectJsonInfinitePaginationResult = function <T>(
  this: HttpBuilder,
  typeOrMapper: TypeOrMapper<T>
) {
  this.message.headers.set("Accept", "application/json");
  return this.useHandler((response) => {
    return response.rawResponse
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
  });
};
