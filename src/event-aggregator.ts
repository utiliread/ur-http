import { HttpResponse } from "./http-response";

export interface EventAggregator {
  publish(event: HttpEvent): void;
  subscribe(
    eventType: new() => HttpEvent,
    callback: (event: HttpEvent) => unknown
  ): Subscription;
}

export class HttpEvent {
    hook!: "sent" | "received";
    url!: string;
    reducer!: Function;
    params: any;
    response!: HttpResponse;
    value?: any;
}

export interface Subscription {
  dispose(): void;
}
