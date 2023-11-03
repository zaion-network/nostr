#!/usr/bin/env bun

const res = await Bun.build({
  entrypoints: ["./src/index.ts", "./web/index.ts"],
  outdir: "dist",
  target: "bun",
});
const res2 = await Bun.build({
  entrypoints: ["./server/index.ts"],
  outdir: "dist/server",
  target: "node",
});
const res3 = await Bun.build({
  entrypoints: ["./server/noble/index.ts"],
  outdir: "dist/server/noble",
  target: "node",
});
const res4 = await Bun.build({
  entrypoints: ["./server/relay/index.ts"],
  outdir: "dist/server/relay",
  target: "node",
});

console.log(res);
console.log(res2);
console.log(res3);
console.log(res4);
