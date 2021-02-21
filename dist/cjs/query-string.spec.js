"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var luxon_1 = require("luxon");
var query_string_1 = require("./query-string");
var chai_1 = require("chai");
describe("query-string", function () {
    it("should handle string", function () {
        var qs = query_string_1.QueryString.serialize({
            aString: "hello"
        });
        chai_1.expect(qs).to.equal("?aString=hello");
    });
    it("should handle string array", function () {
        var qs = query_string_1.QueryString.serialize({
            aString: ["hello", "world"]
        });
        chai_1.expect(qs).to.equal("?aString[0]=hello&aString[1]=world");
    });
    it("should handle object array", function () {
        var qs = query_string_1.QueryString.serialize({
            array: [{ a: "hello" }, { b: "world" }]
        });
        chai_1.expect(qs).to.equal("?array[0].a=hello&array[1].b=world");
    });
    it("should handle luxon DateTime in local timezone", function () {
        var datetime = luxon_1.DateTime.fromObject({ year: 2014, month: 11, day: 12, hour: 21, minute: 6 });
        var qs = query_string_1.QueryString.serialize({
            aDateTime: datetime
        });
        chai_1.expect(qs).to.equal("?aDateTime=" + encodeURIComponent("2014-11-12T21:06:00.000+01:00"));
    });
    it("should handle luxon DateTime in utc", function () {
        var datetime = luxon_1.DateTime.fromObject({ year: 2014, month: 11, day: 12, hour: 21, minute: 6 }).toUTC();
        var qs = query_string_1.QueryString.serialize({
            aDateTime: datetime
        });
        chai_1.expect(qs).to.equal("?aDateTime=" + encodeURIComponent("2014-11-12T20:06:00.000Z"));
    });
    it("should handle null", function () {
        var qs = query_string_1.QueryString.serialize({
            null: null
        });
        chai_1.expect(qs).to.equal("?null");
    });
    it("should not include undefined", function () {
        var qs = query_string_1.QueryString.serialize({
            null: undefined
        });
        chai_1.expect(qs).to.equal("");
    });
});
//# sourceMappingURL=query-string.spec.js.map