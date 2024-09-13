import {
  HttpBuilder,
  HttpBuilderOfT,
  getMapper,
  getNullableMapper,
} from "@utiliread/http";
import type {
  InfinitePaginationResult,
  PaginationResult,
  TypeOrMapper,
} from "@utiliread/http";
import { deserialize, serialize } from "@utiliread/json";

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare module "@utiliread/http" {
  interface HttpBuilder {
    withJson(content: any): this;

    expectJson<T>(
      typeOrMapper?: import("@utiliread/http").TypeOrMapper<T>
    ): import("@utiliread/http").HttpBuilderOfT<T>;
    expectJsonArray<T>(
      typeOrMapper: import("@utiliread/http").TypeOrMapper<T>
    ): import("@utiliread/http").HttpBuilderOfT<T[]>;
    expectJsonNullableArray<T>(
      typeOrMapper: import("@utiliread/http").TypeOrMapper<T>
    ): import("@utiliread/http").HttpBuilderOfT<(T | null)[]>;
    expectJsonPaginationResult<T>(
      typeOrMapper: import("@utiliread/http").TypeOrMapper<T>
    ): import("@utiliread/http").HttpBuilderOfT<
      import("@utiliread/http").PaginationResult<T>
    >;
    expectJsonInfinitePaginationResult<T>(
      typeOrMapper: import("@utiliread/http").TypeOrMapper<T>
    ): import("@utiliread/http").HttpBuilderOfT<
      import("@utiliread/http").InfinitePaginationResult<T>
    >;
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
