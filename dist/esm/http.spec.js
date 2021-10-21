import { expect } from 'chai';
import { Http } from './http';
describe("static http", function () {
    it("can get", function () {
        var builder = Http.get("/hello");
        expect(builder.fetch).to.equal(Http.defaults.fetch);
    });
});
describe("instance http", function () {
    it("can get with different timeout", function () {
        var http = new Http();
        var builder = http.get("/hello");
        expect(builder.fetch).to.equal(Http.defaults.fetch);
        expect(builder.timeout).to.equal(undefined);
    });
    it("can get with different timeout", function () {
        var http = new Http({ timeout: 123 });
        var builder = http.get("/hello");
        expect(builder.fetch).to.equal(Http.defaults.fetch);
        expect(builder.timeout).to.equal(123);
    });
    it("can get with different fetch", function () {
        var http = new Http({ fetch: fakeFetch });
        var builder = http.get("/hello");
        expect(builder.fetch).to.equal(fakeFetch);
        expect(builder.timeout).to.equal(undefined);
    });
});
function fakeFetch(input, init) {
    return Promise.resolve(new Response());
}
//# sourceMappingURL=http.spec.js.map