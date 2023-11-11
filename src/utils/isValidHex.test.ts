import { describe, it, expect } from "bun:test";
import { isValidHex } from "./isValidHex";

describe(`${isValidHex.name}`, () => {
  it("controlla export", () => {
    expect(isValidHex).toBeTruthy();
  });
});
