import { deserialize } from "@utiliread/msgpack";
import { HttpBuilder } from "./http-builder";
import { decodeArrayStream, decodeAsync } from "@msgpack/msgpack";
import { getMapper, Mapper, Type } from "./mapping";

type TypeOrMapper<T> = Type<T> | Mapper<T>;

declare module "./http-builder" {
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
    const decoded = await decodeAsync(response.body!);
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
    for await (const item of decodeArrayStream(response.body!)) {
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

  async function* handler(response: Response) {
    const itemFactory = getMapper(deserialize, typeOrMapper);
    for await (const item of decodeArrayStream(response.body!)) {
      yield itemFactory(item);
    }
  }

  return this.useHandler((response) => Promise.resolve(handler(response)));
};
