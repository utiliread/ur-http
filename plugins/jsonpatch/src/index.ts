import { HttpBuilder, HttpBuilderOfT } from "@utiliread/http";

import { Operation } from "@utiliread/jsonpatch";
import { serialize } from "@utiliread/json";

// Force declarations to be module augmentations instead of ambient module declarations
// https://www.typescriptlang.org/docs/handbook/modules/reference.html#ambient-modules
export default {};

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare module "@utiliread/http" {
  interface HttpBuilder {
    withJsonPatch(operations: Operation[]): this;
  }
  
  interface HttpBuilderOfT<T> {
    withJsonPatch(operations: Operation[]): this;
  }
}

HttpBuilder.prototype.withJsonPatch = function (
  this: HttpBuilder,
  operations: Operation[]
) {
  this.message.content = serialize(operations);
  this.message.contentType = "application/json-patch+json";
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
