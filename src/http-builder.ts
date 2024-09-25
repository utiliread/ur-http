import { HttpResponse, HttpResponseOfT } from "./http-response";

import { EventAggregator } from "./event-aggregator";
import { Fetch } from "./http";
import { Http } from "./http";
import { TimeoutError } from "./errors/timeout-error";

export class HttpBuilder {
  private _ensureSuccessStatusCode = true;
  private _onSend = new EventAggregator<[Message]>();
  private _onSent = new EventAggregator<[HttpResponse, Message]>();

  constructor(
    public message: Message,
    public options: RequestOptions,
    /** @internal */ public http: Http,
  ) {}

  onSend(callback: (request: Message) => void | Promise<void>) {
    this._onSend.subscribe(callback);
    return this;
  }

  onSent(
    callback: (
      response: HttpResponse,
      request: Message,
    ) => void | Promise<void>,
  ) {
    this._onSent.subscribe(callback);
    return this;
  }

  useHandler<T>(handler: (response: HttpResponse) => Promise<T>) {
    return new HttpBuilderOfT<T>(this, handler);
  }

  async send(abortSignal?: AbortSignal) {
    if (this.message.contentType) {
      this.message.headers.set("Content-Type", this.message.contentType);
    }

    // Resolve the final url and assign it to the message
    // This makes the final url apper in onSend, onSent, and on Received handlers
    this.message.url = this.getUrl();

    await this._onSend.publish(this.message);
    await this.http._onSend.publish(this.message);

    const init: RequestInit = {
      method: this.message.method,
      body: this.message.content,
      headers: this.message.headers,
      mode: this.message.mode,
    };

    if (abortSignal || this.options.timeout) {
      var outerController = new AbortController();
      if (abortSignal) {
        abortSignal.addEventListener("abort", () => {
          outerController.abort();
        });
      }

      init.signal = outerController.signal;
    }

    const fetchResponsePromise = this.options.fetch(this.message.url, init);
    let fetchResponse: Response;

    if (this.options.timeout) {
      fetchResponse = await Promise.race([
        fetchResponsePromise,
        new Promise<Response>((_, reject) =>
          setTimeout(() => {
            outerController.abort();
            reject(new TimeoutError());
          }, this.options.timeout),
        ),
      ]);
    } else {
      fetchResponse = await fetchResponsePromise;
    }

    const httpResponse = new HttpResponse(fetchResponse);

    if (this._ensureSuccessStatusCode) {
      httpResponse.ensureSuccessfulStatusCode();
    }

    await this._onSent.publish(httpResponse, this.message);
    await this.http._onSent.publish(httpResponse, this.message);

    return httpResponse;
  }

  getUrl() {
    let baseUrl = this.options.baseUrl;
    if (!baseUrl) {
      return this.message.url;
    }

    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.substr(0, baseUrl.length - 1);
    }

    if (this.message.url.startsWith("/")) {
      return baseUrl + this.message.url;
    } else {
      return baseUrl + "/" + this.message.url;
    }
  }

  ensureSuccessStatusCode(ensureSuccessStatusCode?: boolean) {
    this._ensureSuccessStatusCode =
      ensureSuccessStatusCode === false ? false : true;

    return this;
  }

  useCors(mode: RequestMode) {
    this.message.mode = mode;
    return this;
  }

  useTimeout(timeout: number | null) {
    this.options.timeout = timeout || undefined;
    return this;
  }

  // Content Extensions

  with(content: any, contentType?: string) {
    this.message.content = content;
    this.message.contentType = contentType;
    return this;
  }

  withForm(content: FormData) {
    this.message.content = content;
    this.message.contentType = undefined;
    return this;
  }

  // Modifier Extensions

  addHeader(name: string, value: string) {
    this.message.headers.append(name, value);
    return this;
  }

  // Expect Extensions

  expectString() {
    return this.useHandler((response) => {
      return response.rawResponse.text();
    });
  }

  expectBinary() {
    return this.useHandler((response) => {
      return response.rawResponse.arrayBuffer();
    });
  }
}

export class HttpBuilderOfT<T> extends HttpBuilder {
  private _onReceived = new EventAggregator<[HttpResponseOfT<T>, Message, T]>();

  constructor(
    private inner: HttpBuilder,
    private handler: (response: HttpResponse) => Promise<T>,
  ) {
    super(inner.message, inner.options, inner.http);
  }

  onSend(callback: (request: Message) => void | Promise<void>) {
    this.inner.onSend(callback);
    return this;
  }

  onSent(
    callback: (
      response: HttpResponse,
      request: Message,
    ) => void | Promise<void>,
  ) {
    this.inner.onSent(callback);
    return this;
  }

  ensureSuccessStatusCode(ensureSuccessStatusCode?: boolean) {
    this.inner.ensureSuccessStatusCode(ensureSuccessStatusCode);
    return this;
  }

  useCors(mode: RequestMode) {
    this.inner.useCors(mode);
    return this;
  }

  useTimeout(timeout: number) {
    this.inner.useTimeout(timeout);
    return this;
  }

  allowEmptyResponse() {
    if (this._onReceived.any) {
      throw new Error(
        "onReceived() must be called after allowEmptyResponse() because the callback type changes",
      );
    }

    return new HttpBuilderOfT<T | null>(this.inner, (response) => {
      if (response.statusCode === 204) {
        return Promise.resolve(null);
      }

      return this.handler(response);
    });
  }

  onReceived(
    callback: (
      response: HttpResponseOfT<T>,
      request: Message,
      value: T,
    ) => void | Promise<void>,
  ) {
    this._onReceived.subscribe(callback);
    return this;
  }

  send(abortSignal?: AbortSignal) {
    const responsePromise = this.inner
      .send(abortSignal)
      .then((x) => new HttpResponseOfT<T>(x.rawResponse, this.handler));

    return asSendPromise(responsePromise, () =>
      responsePromise.then((response) => this.handleReceive(response)),
    );
  }

  transfer(abortSignal?: AbortSignal) {
    return this.send(abortSignal).then((response) =>
      this.handleReceive(response),
    );
  }

  private async handleReceive(response: HttpResponseOfT<T>) {
    const request = this.message;
    const value = await response.receive();

    await this._onReceived.publish(response, request, value);
    await this.http._onReceived.publish(response, request, value);

    return value;
  }
}

export type HttpMethod = "HEAD" | "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

export interface Message {
  method: HttpMethod;
  url: string;
  headers: Headers;
  content?: any;
  contentType?: string;
  mode?: RequestMode;
  properties: { [key: string]: any };
}

export interface RequestOptions {
  fetch: Fetch;
  timeout?: number;
  baseUrl?: string;
}

export interface SendPromise<T> extends Promise<HttpResponseOfT<T>> {
  thenReceive(): Promise<T>;
}

function asSendPromise<T>(
  responsePromise: Promise<HttpResponse>,
  thenReceive: () => Promise<T>,
): SendPromise<T> {
  const sendPromise = responsePromise as SendPromise<T>;
  sendPromise.thenReceive = thenReceive;
  return sendPromise;
}
