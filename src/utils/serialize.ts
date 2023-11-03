import { hashIt } from "@zaionstate/zaionbase/crypto";

const sha256 = (obj: any, length: 32 | 64 = 64): string => {
  return hashIt(JSON.stringify(obj)).slice(0, length).toLowerCase();
};

const DEFAULT: options = { algorythim: "sha256", length: 32 };

interface options {
  length?: 32 | 64;
  algorythim?: "sha256" | "hmac";
}

export function serialize<T>(obj: T, options: options = DEFAULT) {
  if ((options && !options.algorythim) || !options.length) {
    options = { ...DEFAULT, ...options };
  }
  if (options.algorythim === "sha256") {
    return sha256(obj, options.length);
  }
  if (options.algorythim === "hmac") {
    throw new Error("not yet implemented");
  } else throw new Error("algorythm type not supported");
}
