import { HttpBuilder, HttpBuilderOfT } from "./http-builder";
import { InfinitePaginationResult, PaginationResult } from "./pagination";
import { deserialize, serialize } from "@utiliread/json";
import { getMapper, getNullableMapper, Mapper, Type } from "./mapping";
import type { Operation } from "@utiliread/jsonpatch";

type TypeOrMapper<T> = Type<T> | Mapper<T>;

declare module "./http-builder" {
  interface HttpBuilder {
    withJson(content: any): this;
    withJsonPatch(operations: Operation[]): this;

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
    withJsonPatch(operations: Operation[]): this;
  }
}

HttpBuilder.prototype.withJson = function (this: HttpBuilder, content: any) {
  this.message.content = serialize(content);
  this.message.contentType = "application/json";
  return this;
};

HttpBuilder.prototype.withJsonPatch = function (
  this: HttpBuilder,
  operations: Operation[]
) {
  this.message.content = serialize(operations);
  this.message.contentType = "application/json-patch+json";
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

HttpBuilderOfT.prototype.withJsonPatch = function <T>(
  this: HttpBuilderOfT<T>,
  operations: Operation[]
) {
  this.message.content = serialize(operations);
  this.message.contentType = "application/json-patch+json";
  return this;
};

HttpBuilder.prototype.expectJson = function <T>(
  this: HttpBuilder,
  typeOrMapper?: TypeOrMapper<T>
) {
  this.message.headers.set("Accept", "application/json");
  return this.useHandler((response) => {
    return response.json().then((x) => getMapper(deserialize, typeOrMapper)(x));
  });
};

HttpBuilder.prototype.expectJsonArray = function <T>(
  this: HttpBuilder,
  typeOrMapper: TypeOrMapper<T>
) {
  this.message.headers.set("Accept", "application/json");
  return this.useHandler((response) => {
    return response.json().then((x: any[]) => {
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
    return response.json().then((x: any[]) => {
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
    return response.json().then((x: PaginationResult<any>) => {
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
    return response.json().then((x: InfinitePaginationResult<any>) => {
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
