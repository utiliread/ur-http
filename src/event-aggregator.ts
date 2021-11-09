export interface EventAggregator {
  publish(event: any, data?: any): void;
  subscribe<T>(
    event: T,
    callback: (event: T, data?: any) => unknown
  ): Subscription;
}

export interface Subscription {
  dispose(): void;
}
