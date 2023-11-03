import { serialize } from "./serialize";
// const serialized0 = serialize(["baby"], { algorythim: "hmac" });
const serialized1 = serialize(["baby"], { length: 64 });
const serialized2 = serialize(["baby"]);
const serialized3 = serialize(["baby"], { length: 32, algorythim: "sha256" });
// console.log(serialized0);
console.log(serialized1);
console.log(serialized2);
