#!/usr/bin/env -S deno run --allow-write --allow-read --allow-net --allow-run
import {
  assertAllTracked,
  CommandArgs,
  GitHooks,
  runCommands,
  sh,
  __,
} from "./deps.ts";
import { ArduinoSketch, Firmata } from "./deno/ino.ts";
import { Espruino } from "./deno/ts.ts";
const { __dirname } = __(import.meta);

const { remove } = Deno;

const exec = sh;

const fmt = (args: CommandArgs) =>
  sh(
    `deno fmt ${args.c ? "--check " : ""}./run.ts ./deno`,
  );

const gitHooks = new GitHooks({
  "pre-commit": async () => {
    await assertAllTracked();
    await fmt({ c: 1, _: [] });
  },
});
const hooks = (args: CommandArgs) => gitHooks.run(args);

const espruino = new Espruino();
const src = `./sketch`;

const build = async (args: CommandArgs) => {
  const { _: [name = "test"] } = args;
  try {
    await remove("./dist/index.js");
  } catch (e) {
  }
  await exec(`npx ncc build ${src}/ts/${name}/index.ts`); // 👉 ./dist/index.js
  await exec(`npx webpack --mode production`); // 👉 ./dist/result.js

  // Replace bad requires:
  const path = __dirname + "/dist/result.js";
  const text = await Deno.readTextFile(path);
  await Deno.writeTextFile(
    path,
    text
      .replace(
        /eval\("require"\)\("@amperka/g,
        'require("@amperka',
      ),
  );
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
  runFirmata: () => exec(`node sketch/js/firmata/main.js`),
  espruino: {
    build,
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
