import { expect } from 'chai';
import { Http } from './http';

describe("static http", () => {
    it("can get", () => {
        const builder = Http.get("/hello");
        expect(builder.fetch).to.equal(Http.defaults.fetch);
    });
});

describe("instance http", () => {
    it("can get with different timeout", () => {
        const http = new Http();
        const builder = http.get("/hello");
        expect(builder.fetch).to.equal(Http.defaults.fetch);
        expect(builder.timeout).to.equal(undefined);
    });

    it("can get with different timeout", () => {
        const http = new Http({ timeout: 123 });
        const builder = http.get("/hello");
        expect(builder.fetch).to.equal(Http.defaults.fetch);
        expect(builder.timeout).to.equal(123);
    });

    it("can get with different fetch", () => {
        const http = new Http({ fetch: fakeFetch });
        const builder = http.get("/hello");
        expect(builder.fetch).to.equal(fakeFetch);
        expect(builder.timeout).to.equal(undefined);
    });
});

function fakeFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    return Promise.resolve(new Response());
}