import { HttpBuilder, HttpBuilderOfT, Message } from "./http-builder";
import { HttpResponse } from "./http-response";

interface Events {
  sent: (response: HttpResponse, request: Message) => void | Promise<void>;
}

interface EventsOfT<T> extends Events {
  received: (
    response: HttpResponse,
    request: Message,
    value: T
  ) => void | Promise<void>;
}

export function events<B extends HttpBuilder, P extends any[]>(
  action: (...params: P) => B,
  configure: (...params: P) => Partial<Events>
): (...params: P) => B;
export function events<B extends HttpBuilderOfT<T>, P extends any[], T>(
  action: (...params: P) => B,
  configure: (...params: P) => Partial<EventsOfT<T>>
): (...params: P) => B;
export function events<B extends HttpBuilderOfT<T>, P extends any[], T>(
  action: (...params: P) => B,
  configure: (...params: P) => Partial<EventsOfT<T>>
): (...params: P) => B {
  return function (...params: P) {
    const builder = action(...params);
    const events = configure(...params);
    if (events.sent) {
      builder.onSent(events.sent);
    }
    if (builder instanceof HttpBuilderOfT && events.received) {
      builder.onReceived(events.received);
    }
    return builder;
  };
}
