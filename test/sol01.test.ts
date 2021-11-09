import { introMsg } from "../src/intro"
import * as T from "@effect-ts/core/Effect"

describe("Mars Kata", () => {
  describe("Intro", () => {
    it("should work", async () => {
      const result = await T.runPromise(T.succeed(introMsg()));
      expect(result).toBe("ok");
    });
  });
});
