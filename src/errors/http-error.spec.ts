import { HttpError, isHttpError } from "./http-error";

import { expect } from "chai";
import { statusCodes } from "@utiliread/http";

describe("HttpError", () => {
  it("can determine if is error", () => {
    const error = new HttpError(statusCodes.status200OK);

    expect(isHttpError(error)).to.equal(true);
    expect(error instanceof Error).to.equal(true);
    expect(error instanceof HttpError).to.equal(true);
  });
});
