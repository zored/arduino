#!/usr/bin/env -S deno run --allow-write --allow-read --allow-net --allow-run --quiet
import { Args } from "https://deno.land/std/flags/mod.ts";
import {
  runCommands,
  GitHooks,
  Runner,
  assertAllTracked,
} from "./deps.ts";
import { Firmata, ArduinoSketch } from "./deno/lib.ts";
const fmt = () =>
  new Runner().run(
    `deno fmt ./run.ts ./deno ./espruino/run.ts ./espruino/deno`,
  );

const gitHooks = new GitHooks({
  "pre-commit": async () => {
    await assertAllTracked();
    await fmt();
  },
});
const hooks = (args: Args) => gitHooks.run(args);

runCommands({
  fmt,
  hooks,
  flash: async (args) => {
    const name = args._[0] || "";
    switch (name) {
      case "":
        throw new Error("Specify sketch name!");
      case "Firmata":
        await new Firmata().download(name);
    }
    const sketch = new ArduinoSketch(`sketch/${name}`);
    await sketch.compile();
    await sketch.flash();
  },
  run: async () => await new Runner().run(`node js/main.js`),
});
