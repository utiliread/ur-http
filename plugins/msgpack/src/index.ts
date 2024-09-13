import { HttpBuilder, HttpResponse, TypeOrMapper, getMapper } from "@utiliread/http";
import { decodeArrayStream, decodeAsync } from "@msgpack/msgpack";

import { deserialize } from "@utiliread/msgpack";

// Force declarations to be module augmentations instead of ambient module declarations
// https://www.typescriptlang.org/docs/handbook/modules/reference.html#ambient-modules
export default {};

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare module "@utiliread/http" {
  interface HttpBuilder {
    expectMessagePack<T>(
      typeOrMapper?: TypeOrMapper<T>
    ): HttpBuilderOfT<T>;
    expectMessagePackArray<T>(
      typeOrMapper?: TypeOrMapper<T>
    ): HttpBuilderOfT<T[]>;
    streamMessagePackArray<T>(
      typeOrMapper?: TypeOrMapper<T>
    ): HttpBuilderOfT<AsyncGenerator<T, void, unknown>>;
  }
}

HttpBuilder.prototype.expectMessagePack = function <T>(
  this: HttpBuilder,
  typeOrMapper?: TypeOrMapper<T>
) {
  this.message.headers.set("Accept", "application/x-msgpack");
  return this.useHandler(async (response) => {
    const itemFactory = getMapper(deserialize, typeOrMapper);
    const decoded = await decodeAsync(response.rawResponse.body!);
    return itemFactory(decoded);
  });
};

HttpBuilder.prototype.expectMessagePackArray = function <T>(
  this: HttpBuilder,
  typeOrMapper?: TypeOrMapper<T>
) {
  this.message.headers.set("Accept", "application/x-msgpack");
  return this.useHandler(async (response) => {
    const items: T[] = [];
    const itemFactory = getMapper(deserialize, typeOrMapper);
    for await (const item of decodeArrayStream(response.rawResponse.body!)) {
      items.push(itemFactory(item));
    }
    return items;
  });
};

HttpBuilder.prototype.streamMessagePackArray = function <T>(
  this: HttpBuilder,
  typeOrMapper?: TypeOrMapper<T>
) {
  this.message.headers.set("Accept", "application/x-msgpack");

  async function* handler(response: HttpResponse) {
    const itemFactory = getMapper(deserialize, typeOrMapper);
    for await (const item of decodeArrayStream(response.rawResponse.body!)) {
      yield itemFactory(item);
    }
  }

  return this.useHandler((response) => Promise.resolve(handler(response)));
};
