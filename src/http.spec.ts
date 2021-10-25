import { expect } from 'chai';
import { Http } from './http';

describe("static http", () => {
    it("can get", () => {
        const builder = Http.get("/hello");
        expect(builder.options.fetch).to.equal(Http.defaults.fetch);
    });

    it("can get with changed default fetch", () => {
        Http.get("/hello") // Creates singleton
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
});

function fakeFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    return Promise.resolve(new Response());
}