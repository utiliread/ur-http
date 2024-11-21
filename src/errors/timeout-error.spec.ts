import { TimeoutError, isTimeoutError } from "./timeout-error";

import { expect } from "chai";

describe("TimeoutError", () => {
  it("can determine if is error", () => {
    const error = new TimeoutError();

    expect(isTimeoutError(error)).to.equal(true);
    expect(error instanceof Error).to.equal(true);
    expect(error instanceof TimeoutError).to.equal(true);
  });
});
