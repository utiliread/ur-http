import { DateTime } from "luxon";
import { QueryString } from "./query-string";
import { expect } from "chai";

describe("query-string", () => {
  it("should handle string", () => {
    const qs = QueryString.serialize({
      aString: "hello",
    });

    expect(qs).to.equal("?aString=hello");
  });

  it("should handle string array", () => {
    const qs = QueryString.serialize({
      aString: ["hello", "world"],
    });

    expect(qs).to.equal("?aString[0]=hello&aString[1]=world");
  });

  it("should handle object array", () => {
    const qs = QueryString.serialize({
      array: [{ a: "hello" }, { b: "world" }],
    });

    expect(qs).to.equal("?array[0].a=hello&array[1].b=world");
  });

  it("should handle luxon DateTime in local timezone", () => {
    const datetime = DateTime.fromObject({
      year: 2014,
      month: 11,
      day: 12,
      hour: 21,
      minute: 6,
    });
    const qs = QueryString.serialize({
      aDateTime: datetime,
    });

    expect(qs).to.equal(
      "?aDateTime=" + encodeURIComponent("2014-11-12T21:06:00.000+01:00"),
    );
  });

  it("should handle luxon DateTime in utc", () => {
    const datetime = DateTime.fromObject({
      year: 2014,
      month: 11,
      day: 12,
      hour: 21,
      minute: 6,
    }).toUTC();
    const qs = QueryString.serialize({
      aDateTime: datetime,
    });

    expect(qs).to.equal(
      "?aDateTime=" + encodeURIComponent("2014-11-12T20:06:00.000Z"),
    );
  });

  it("should handle null", () => {
    const qs = QueryString.serialize({
      null: null,
    });

    expect(qs).to.equal("?null");
  });

  it("should not include undefined", () => {
    const qs = QueryString.serialize({
      null: undefined,
    });

    expect(qs).to.equal("");
  });
});
