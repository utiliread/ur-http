import {
  HttpBuilder,
  HttpBuilderOfT,
  HttpResponse,
  Mapping,
} from "@utiliread/http";
import { decodeArrayStream, decodeAsync } from "@msgpack/msgpack";

import { deserialize } from "@utiliread/msgpack";

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare module "@utiliread/http" {
  interface HttpBuilder {
    expectMessagePack<T>(
      typeOrMapper?: Mapping.TypeOrMapper<T>,
    ): HttpBuilderOfT<T>;
    expectMessagePackArray<T>(
      typeOrMapper?: Mapping.TypeOrMapper<T>,
    ): HttpBuilderOfT<T[]>;
    streamMessagePackArray<T>(
      typeOrMapper?: Mapping.TypeOrMapper<T>,
    ): HttpBuilderOfT<AsyncGenerator<T, void, unknown>>;
  }
}

HttpBuilder.prototype.expectMessagePack = function <T>(
  this: HttpBuilder,
  typeOrMapper?: Mapping.TypeOrMapper<T>,
) {
  this.message.headers.set("Accept", "application/x-msgpack");
  return this.useHandler(async (response) => {
    const itemFactory = Mapping.getMapper(deserialize, typeOrMapper);
    const decoded = await decodeAsync(response.rawResponse.body!);
    return itemFactory(decoded);
  });
};

HttpBuilder.prototype.expectMessagePackArray = function <T>(
  this: HttpBuilder,
  typeOrMapper?: Mapping.TypeOrMapper<T>,
) {
  this.message.headers.set("Accept", "application/x-msgpack");
  return this.useHandler(async (response) => {
    const items: T[] = [];
    const itemFactory = Mapping.getMapper(deserialize, typeOrMapper);
    for await (const item of decodeArrayStream(response.rawResponse.body!)) {
      items.push(itemFactory(item));
    }
    return items;
  });
};

HttpBuilder.prototype.streamMessagePackArray = function <T>(
  this: HttpBuilder,
  typeOrMapper?: Mapping.TypeOrMapper<T>,
) {
  this.message.headers.set("Accept", "application/x-msgpack");

  async function* handler(response: HttpResponse) {
    const itemFactory = Mapping.getMapper(deserialize, typeOrMapper);
    for await (const item of decodeArrayStream(response.rawResponse.body!)) {
      yield itemFactory(item);
    }
  }

  return this.useHandler((response) => Promise.resolve(handler(response)));
};
