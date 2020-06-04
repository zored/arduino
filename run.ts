#!/usr/bin/env -S deno run --allow-write --allow-read --allow-net --allow-run --quiet
import { Args } from "https://deno.land/std/flags/mod.ts";
import {
  Commands,
  GitHooks,
  Runner,
  assertAllTracked,
} from "https://raw.githubusercontent.com/zored/deno/v0.0.28/mod.ts";
import { Firmata, Espruino, ArduinoSketch } from "./deno/lib.ts";
const fmt = () => new Runner().run(`deno fmt ./run.ts ./deno`);

const gitHooks = new GitHooks({
  "pre-commit": async () => {
    await assertAllTracked();
    await fmt();
  },
});
const hooks = (args: Args) => gitHooks.run(args);

const espruino = new Espruino();
const commands = new Commands({
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
  espruino: {
    upload: async ({ _: [file], p }) =>
      console.log(
        await espruino.upload(
          p ?? (await espruino.iskraJsPort() ?? "") + "",
          file + "",
        ),
      ),
    ports: async () => console.log((await espruino.ports()).join("\n")),
  },
  run: async () => await new Runner().run(`node js/main.js`),
});

await commands.runAndExit();
