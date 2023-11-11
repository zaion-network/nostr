import { describe, it, expect } from "bun:test";
import { serialize } from "./serialize";

describe(`${serialize.name}`, () => {
  it("controlla membri", () => {
    expect(serialize).toBeTruthy();
  });
  it("test1", () => {
    const objToSerialize = {
      oggetto: "da serializzare",
      per: {
        testare: "il funzionamento",
        di: { serialize: "in serialize" },
      },
    };
    const EXPECTED =
      "7b226f67676574746f223a2264612073657269616c697a7a617265222c22706572223a7b2274657374617265223a22696c2066756e7a696f6e616d656e746f222c226469223a7b2273657269616c697a65223a22696e2073657269616c697a65227d7d7d";
    const hex = serialize(objToSerialize);
    expect(hex).toEqual(EXPECTED);
  });
});
