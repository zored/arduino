#!/usr/bin/env -S deno run --allow-write --allow-read --allow-net --allow-run
import {
  CommandArgs,
  runCommands,
  GitHooks,
  Runner,
  assertAllTracked,
} from "./deps.ts";
const { remove } = Deno;

const exec = (() => {
  const runner = new Runner();
  return async (command: string) => {
    console.log(`\n\n${command}\n=====\n`);
    return await runner.run(command);
  };
})();

import { Firmata, ArduinoSketch } from "./deno/ino.ts";
import { Espruino } from "./deno/ts.ts";
const fmt = () =>
  new Runner().run(
    `deno fmt ./run.ts ./deno`,
  );

const gitHooks = new GitHooks({
  "pre-commit": async () => {
    await assertAllTracked();
    await fmt();
  },
});
const hooks = (args: CommandArgs) => gitHooks.run(args);

const espruino = new Espruino();
const src = `./sketch`;

const build = async (args: CommandArgs) => {
  const { _: [name = "test"] } = args;
  try {
    await remove("./dist/index.js");
  } catch (e) {}
  await exec(`npx ncc build ${src}/ts/${name}/index.ts`); // 👉 ./dist/index.js
  await exec(`npx webpack --mode production`); // 👉 ./dist/result.js
};

runCommands({
  init: () => exec(`yarn install`),
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
    const sketch = new ArduinoSketch(`${src}/${name}`);
    await sketch.compile();
    await sketch.flash();
  },
  build,
  runFirmata: () => exec(`node sketch/js/firmata/main.js`),
  espruino: {
    upload: async ({ _: [file = `./dist/result.js`], p, build: buildName }) => {
      if (buildName) {
        await build({ _: [buildName] });
      }
      console.log(
        await espruino.upload(
          p ?? (await espruino.iskraJsPort() ?? "") + "",
          file + "",
        ),
      );
    },
    ports: async () => console.log((await espruino.ports()).join("\n")),
  },
});
