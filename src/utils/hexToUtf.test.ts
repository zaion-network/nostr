import { describe, it, expect } from "bun:test";
import { hexToUtf8 } from "./hexToUtf";

describe(`${hexToUtf8.name}`, () => {
  it("controlla esistenza", () => {
    expect(hexToUtf8).toBeTruthy();
  });
  it("test1", () => {
    expect(hexToUtf8("48656c6c6f2c20776f726c6421")).toEqual("Hello, world!");
  });
});
