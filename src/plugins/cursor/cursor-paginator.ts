import { HttpBuilderOfT } from "@utiliread/http";
import { ICursorPage } from "./cursor-page";

/** Options for {@link CursorPaginator.fromBuilder}. */
export interface CursorPageableFromBuilderOptions {
  /**
   * The name of the query parameter used to pass the cursor to the server.
   * @default "cursor"
   */
  cursorParamName?: string;
}

/**
 * Provides cursor-based pagination over a remote collection.
 *
 * A `CursorPaginator` can be consumed in several ways:
 * - **Awaited** (`await pageable`) — resolves with the first page.
 * - **Async iterated** (`for await (const item of pageable)`) — iterates every item across all pages.
 * - **Page iterated** (`for await (const page of pageable.pages())`) — iterates every page.
 * - **Collected** (`pageable.toArray()` / `pageable.toMap(...)`) — materialises all items.
 *
 * @typeParam T     - The type of individual items.
 * @typeParam TPage - The concrete page type returned by the server (defaults to {@link ICursorPage}\<T\>).
 */
export class CursorPaginator<T, TPage extends ICursorPage<T> = ICursorPage<T>>
  implements PromiseLike<TPage>, AsyncIterable<T>
{
  private _firstPage?: Promise<TPage>;

  /**
   * @param fetchFirstPage - Fetches the first page, optionally honouring a cancellation signal.
   * @param fetchPage      - Fetches a subsequent page identified by the given cursor.
   */
  constructor(
    private readonly fetchFirstPage: (signal?: AbortSignal) => Promise<TPage>,
    private readonly fetchPage: (
      cursor: string,
      signal?: AbortSignal,
    ) => Promise<TPage>,
  ) {}

  /**
   * Creates a `CursorPaginator` from an {@link HttpBuilderOfT} that already expects a cursor page.
   *
   * The builder's URL is used as the base for all requests.  On subsequent pages the cursor
   * query parameter (default: `"cursor"`) is appended automatically.
   *
   * @param builder - A configured HTTP builder whose response type is a cursor page.
   * @param options - Optional settings, e.g. a custom cursor parameter name.
   */
  static fromBuilder<TPage extends ICursorPage<any>>(
    builder: HttpBuilderOfT<TPage>,
    options?: CursorPageableFromBuilderOptions,
  ): CursorPaginator<TPage extends ICursorPage<infer T> ? T : never, TPage> {
    const originalUrl = builder.message.url;
    const cursorParamName = options?.cursorParamName ?? "cursor";
    const fetchFirstPage = (signal?: AbortSignal): Promise<TPage> => {
      builder.message.url = originalUrl;
      return builder.transfer(signal);
    };

    const fetchPage = async (
      cursor: string,
      signal?: AbortSignal,
    ): Promise<TPage> => {
      try {
        const u = new URL(originalUrl);
        u.searchParams.set(cursorParamName, cursor);
        builder.message.url = u.href;
      } catch {
        const u = new URL(originalUrl, "http://x");
        u.searchParams.set(cursorParamName, cursor);
        builder.message.url = u.pathname + u.search;
      }
      try {
        return await builder.transfer(signal);
      } finally {
        builder.message.url = originalUrl;
      }
    };

    return new CursorPaginator(fetchFirstPage, fetchPage) as CursorPaginator<
      TPage extends ICursorPage<infer T> ? T : never,
      TPage
    >;
  }

  /**
   * Allows the pageable to be awaited directly, resolving with the first page.
   * Subsequent `await` calls return the cached first page without re-fetching.
   */
  then<TResult1 = TPage, TResult2 = never>(
    onfulfilled?: ((value: TPage) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this._getOrFetchFirstPage().then(onfulfilled, onrejected);
  }

  /** Iterates over every individual item across all pages. */
  [Symbol.asyncIterator](): AsyncGenerator<T> {
    return this._iterateItems();
  }

  /**
   * Iterates over each page until there are no more.
   *
   * @param signal - An optional signal used to abort in-flight requests.
   */
  async *pages(signal?: AbortSignal): AsyncGenerator<TPage> {
    let page = await this._getOrFetchFirstPage(signal);
    yield page;
    while (page.hasMore) {
      page = await this.fetchPage(page.nextCursor!, signal);
      yield page;
    }
  }

  /**
   * Fetches all pages and returns every item as a flat array.
   *
   * @param signal - An optional signal used to abort in-flight requests.
   */
  async toArray(signal?: AbortSignal): Promise<T[]> {
    const results: T[] = [];
    for await (const page of this.pages(signal)) {
      results.push(...page.items);
    }
    return results;
  }

  /**
   * Fetches all pages and returns a `Map` keyed by the result of `keySelector`.
   *
   * @param keySelector  - Derives the map key from each item.
   * @param signal       - An optional signal used to abort in-flight requests.
   */
  toMap<K>(
    keySelector: (item: T) => K,
    itemSelector?: undefined,
    signal?: AbortSignal,
  ): Promise<Map<K, T>>;
  toMap<K>(
    keySelector: (item: T) => K,
    signal: AbortSignal,
  ): Promise<Map<K, T>>;
  /**
   * Fetches all pages and returns a `Map` keyed by `keySelector` with values projected by `itemSelector`.
   *
   * @param keySelector  - Derives the map key from each item.
   * @param itemSelector - Derives the map value from each item.
   * @param signal       - An optional signal used to abort in-flight requests.
   */
  toMap<K, V>(
    keySelector: (item: T) => K,
    itemSelector: (item: T) => V,
    signal?: AbortSignal,
  ): Promise<Map<K, V>>;
  async toMap<K, V>(
    keySelector: (item: T) => K,
    itemSelectorOrSignal?: ((item: T) => V) | AbortSignal,
    signal?: AbortSignal,
  ): Promise<Map<K, V | T>> {
    let itemSelector: ((item: T) => V) | undefined;
    let resolvedSignal: AbortSignal | undefined;

    if (typeof itemSelectorOrSignal === "function") {
      itemSelector = itemSelectorOrSignal;
      resolvedSignal = signal;
    } else {
      resolvedSignal = itemSelectorOrSignal;
    }

    const map = new Map<K, V | T>();
    for await (const page of this.pages(resolvedSignal)) {
      for (const item of page.items) {
        map.set(keySelector(item), itemSelector ? itemSelector(item) : item);
      }
    }
    return map;
  }

  private async *_iterateItems(): AsyncGenerator<T> {
    for await (const page of this.pages()) {
      yield* page.items;
    }
  }

  private _getOrFetchFirstPage(signal?: AbortSignal): Promise<TPage> {
    if (!this._firstPage) {
      this._firstPage = this.fetchFirstPage(signal);
    }
    return this._firstPage;
  }
}
