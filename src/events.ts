import { HttpResponse } from "./http-response";

type CallbackFn = (event: HttpEvent) => void | Promise<void>;

export class HttpEvent {
  hook!: "sent" | "received";
  url!: string;
  reducer!: Function;
  params!: any[];
  response!: HttpResponse;
  value?: any;
}

export interface EventAggregator {
  publish(event: HttpEvent): Promise<void>;
  subscribe(callback: CallbackFn): Subscription;
}

export class DefaultEventAggregator implements EventAggregator {
  private subscribers: CallbackFn[] = [];

  async publish(event: HttpEvent) {
    const subscribers = this.subscribers.slice();
    for (const subscriber of subscribers) {
      await Promise.resolve(subscriber(event));
    }
  }

  subscribe(callback: CallbackFn): Subscription {
    const subscribers = this.subscribers;
    subscribers.push(callback);
    return {
      dispose: () => {
        const index = subscribers.indexOf(callback);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
      },
    };
  }
}

export interface Subscription {
  dispose(): void;
}
