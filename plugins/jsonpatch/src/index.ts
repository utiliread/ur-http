import { HttpBuilder, HttpBuilderOfT } from "@utiliread/http";

import { serialize } from "@utiliread/json";

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare module "@utiliread/http" {
  interface HttpBuilder {
    withJsonPatch(operations: import("@utiliread/jsonpatch").Operation[]): this;
  }
  
  interface HttpBuilderOfT<T> {
    withJsonPatch(operations: import("@utiliread/jsonpatch").Operation[]): this;
  }
}

HttpBuilder.prototype.withJsonPatch = function (
  this: HttpBuilder,
  operations: import("@utiliread/jsonpatch").Operation[]
) {
  this.message.content = serialize(operations);
  this.message.contentType = "application/json-patch+json";
  return this;
};

HttpBuilderOfT.prototype.withJsonPatch = function <T>(
  this: HttpBuilderOfT<T>,
  operations: import("@utiliread/jsonpatch").Operation[]
) {
  this.message.content = serialize(operations);
  this.message.contentType = "application/json-patch+json";
  return this;
};
