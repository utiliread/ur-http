import { HttpResponse } from "./http-response";

export interface EventAggregator {
  publish<T>(event: HttpEvent<T>): void;
  subscribe<T>(
    eventType: new() => HttpEvent<T>,
    callback: (event: HttpEvent<T>) => unknown
  ): Subscription;
}

export class HttpEvent<T> {
    kind!: "sent" | "received";
    reducer!: T;
    params: any;
    response!: HttpResponse;
    value?: any;
}

export interface Subscription {
  dispose(): void;
}
