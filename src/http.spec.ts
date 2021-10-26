import { expect } from "chai";
import { Http } from "./http";

describe("static http", () => {
  it("can get", () => {
    const builder = Http.get("hello");
    expect(builder.getUrl()).to.equal("hello");
    expect(builder.options.fetch).to.equal(Http.defaults.fetch);
  });

  it("can get with leading /", () => {
    const builder = Http.get("/hello");
    expect(builder.getUrl()).to.equal("/hello");
    expect(builder.options.fetch).to.equal(Http.defaults.fetch);
  });

  it("can get with changed default fetch", () => {
    Http.get("/hello"); // Creates singleton
    // Change static default after request is created
    Http.defaults.fetch = fakeFetch;
    const builder = Http.get("/hello");
    expect(builder.options.fetch).to.equal(fakeFetch);
  });
});

describe("instance http", () => {
  it("can get with different timeout", () => {
    const http = new Http();
    const builder = http.get("/hello");
    expect(builder.options.fetch).to.equal(Http.defaults.fetch);
    expect(builder.options.timeout).to.equal(undefined);
  });

  it("can get with different timeout", () => {
    const http = new Http({ timeout: 123 });
    const builder = http.get("/hello");
    expect(builder.options.fetch).to.equal(Http.defaults.fetch);
    expect(builder.options.timeout).to.equal(123);
  });

  it("can get with different fetch", () => {
    const http = new Http({ fetch: fakeFetch });
    const builder = http.get("/hello");
    expect(builder.options.fetch).to.equal(fakeFetch);
    expect(builder.options.timeout).to.equal(undefined);
  });

  it("can get hello with base url", () => {
    const http = new Http({ baseUrl: "base" });
    const builder = http.get("hello");
    expect(builder.getUrl()).to.equal("base/hello");
  });

  it("can get hello with base/", () => {
    const http = new Http({ baseUrl: "base/" });
    const builder = http.get("hello");
    expect(builder.getUrl()).to.equal("base/hello");
  });

  it("can get /hello with base url", () => {
    const http = new Http({ baseUrl: "base" });
    const builder = http.get("/hello");
    expect(builder.getUrl()).to.equal("base/hello");
  });

  it("can get /hello with base/", () => {
    const http = new Http({ baseUrl: "base/" });
    const builder = http.get("/hello");
    expect(builder.getUrl()).to.equal("base/hello");
  });
});

function fakeFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  return Promise.resolve(new Response());
}
