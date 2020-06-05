#!/usr/bin/env -S deno run --allow-write --allow-read --allow-net --allow-run --quiet
import {
  CommandArgs,
  runCommands,
  GitHooks,
  Runner,
  exec,
  OutputMode,
  assertAllTracked,
} from "./deps.ts";
const { remove, stat } = Deno;
const execLog = async (c: string) => {
  console.log(c);
  const response = await exec(c, { output: OutputMode.Tee });
  if (response.status.code !== 0) {
    throw new Error(`Command exited with code ${response.status.code}!`);
  }
  return response;
};
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
  buildTs: async ({ _: [name = "test"] }) => {
    try {
      await remove("./dist/index.js");
    } catch (e) {}
    await execLog(`npx ncc build ${src}/ts/${name}/index.ts`); // 👉 ./dist/index.js
    await execLog(`npx webpack --mode production`); // 👉 ./dist/result.js
  },
  runFirmata: () => exec(`node sketch/js/firmata/main.js`),
  espruino: {
    upload: async ({ _: [file = `./dist/result.js`], p }) =>
      console.log(
        await espruino.upload(
          p ?? (await espruino.iskraJsPort() ?? "") + "",
          file + "",
        ),
      ),
    ports: async () => console.log((await espruino.ports()).join("\n")),
  },
});
