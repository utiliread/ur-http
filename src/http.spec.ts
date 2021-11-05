import { expect } from "chai";
import { Http } from "./http";
import "./json";

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
    Http.get("/hello"); // Creates internal singleton
    // Change static default after request is created
    const fetch = Http.defaults.fetch;
    Http.defaults.fetch = fakeFetch;
    const builder = Http.get("/hello");
    expect(builder.options.fetch).to.equal(fakeFetch);
    Http.defaults.fetch = fetch;
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

  it("can post json, with then expect", async () => {
    const user = await new Http()
      .post("https://reqres.in/api/users")
      .withJson({
        name: "morpheus",
        job: "leader",
      })
      .expectJson<{ name: string; job: string }>()
      .transfer();

    expect(user.name).to.equal("morpheus");
  });

  it("can post json, expect then with", async () => {
    const user = await new Http()
      .post("https://reqres.in/api/users")
      .expectJson<{ name: string; job: string }>()
      .withJson({
        name: "morpheus",
        job: "leader",
      })
      .transfer();

    expect(user.name).to.equal("morpheus");
  }).timeout(5000);
});

function fakeFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  return Promise.resolve(new Response());
}
