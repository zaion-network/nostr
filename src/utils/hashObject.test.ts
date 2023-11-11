import { hashObject } from "./hashObject";
// const serialized0 = serialize(["baby"], { algorythim: "hmac" });
const serialized1 = hashObject(["baby"], { length: 64 });
const serialized2 = hashObject(["baby"]);
const serialized3 = hashObject(["baby"], { length: 32, algorythim: "sha256" });
// console.log(serialized0);
console.log(serialized1);
console.log(serialized2);
