import { expect } from "chai";
import { isAbortError } from "./abort-error";

describe("AbortError", () => {
    it("can determine if is error", () => {
        const error = new Error();
        error.name = "AbortError";

        expect(isAbortError(error)).to.equal(true);
    });
});