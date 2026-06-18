/**
 * Represents a single page of results from a cursor-based paginated API.
 *
 * @typeParam T - The type of items contained in the page.
 */
export interface ICursorPage<T> {
  /** The items on this page. */
  items: T[];
  /**
   * An opaque cursor pointing to the next page, or `null` if there are no more pages.
   * Pass this value as the `cursor` query parameter to fetch the next page.
   */
  nextCursor: string | null;
  /** Whether more pages are available after this one. */
  hasMore: boolean;
  /** The total number of items across all pages, if provided by the server. */
  totalCount?: number;
}
