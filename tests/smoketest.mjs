import test from "ava";
import { execa } from "execa";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getBinPathSync } from "get-bin-path";

test.before("setup", (t) => {
  t.context.bin = getBinPathSync();
  t.context.tempDirs = [];
});

test.after.always("cleanup temp dirs", async (t) => {
  const arr = [];

  for (const dir of t.context.tempDirs)
    arr.push(
      fs.promises.rm(dir, { recursive: true, maxRetries: 10, retryDelay: 500 })
    );

  await Promise.allSettled(arr);
});

test(`with tsconfig.json file contents: {}`, async (t) => {
  const d = await fs.promises.mkdtemp(path.join(os.tmpdir(), "tsconfigcheck"));
  t.context.tempDirs.push(d);
  const tsconfig = path.join(d, "tsconfig.json");
  await fs.promises.writeFile(tsconfig, "{}", { encoding: "utf8" });

  await t.notThrowsAsync(
    async () => await execa("node", [t.context.bin], { cwd: d })
  );
});

test(`with tsconfig.json file contents from "tsc --init"`, async (t) => {
  const d = await fs.promises.mkdtemp(path.join(os.tmpdir(), "tsconfigcheck"));
  t.context.tempDirs.push(d);

  await t.notThrowsAsync(async () => {
    await execa("npx", ["tsc", "--init"], { cwd: d });
    await execa("node", [t.context.bin], { cwd: d });
  });
});
