"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var http_1 = require("./http");
describe("static http", function () {
    it("can get", function () {
        var builder = http_1.Http.get("/hello");
        chai_1.expect(builder.fetch).to.equal(http_1.Http.defaults.fetch);
    });
});
describe("instance http", function () {
    it("can get with different timeout", function () {
        var http = new http_1.Http();
        var builder = http.get("/hello");
        chai_1.expect(builder.fetch).to.equal(http_1.Http.defaults.fetch);
        chai_1.expect(builder.timeout).to.equal(undefined);
    });
    it("can get with different timeout", function () {
        var http = new http_1.Http({ timeout: 123 });
        var builder = http.get("/hello");
        chai_1.expect(builder.fetch).to.equal(http_1.Http.defaults.fetch);
        chai_1.expect(builder.timeout).to.equal(123);
    });
    it("can get with different fetch", function () {
        var http = new http_1.Http({ fetch: fakeFetch });
        var builder = http.get("/hello");
        chai_1.expect(builder.fetch).to.equal(fakeFetch);
        chai_1.expect(builder.timeout).to.equal(undefined);
    });
});
function fakeFetch(input, init) {
    return Promise.resolve(new Response());
}
//# sourceMappingURL=http.spec.js.map