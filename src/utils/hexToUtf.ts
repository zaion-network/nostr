import { isValidHex } from "./isValidHex";

export function hexToUtf8(hex: string) {
  if (!isValidHex(hex)) throw new Error("not a valid hex");

  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
  }
  return str.replaceAll('"', "");
}
