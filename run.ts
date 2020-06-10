#!/usr/bin/env -S deno run --allow-write --allow-read --allow-net --allow-run
import {
  assertAllTracked,
  CommandArgs,
  GitHooks,
  runCommands,
  sh,
  parseDuration,
} from "./deps.ts";
import { Espruino } from "./deno/ts.ts";
import { AllFlasher } from "./deno/all.ts";
import { UnoFlasher } from "./deno/ino.ts";

const fmt = async (args: CommandArgs) => {
  await sh(`deno fmt ${args.c ? "--check " : ""}./run.ts ./deno`);
  await sh(
    `npx tslint -c tslint.json ./sketch/ts/**/*.ts${args.c ? "" : " --fix"}`,
  );
};

const gitHooks = new GitHooks({
  "pre-commit": async () => {
    await assertAllTracked();
    await fmt({ c: 1, _: [] });
  },
});
const hooks = (args: CommandArgs) => gitHooks.run(args);

const espruino = new Espruino(Deno.args.includes("-v"));
runCommands({
  init: () => sh(`yarn install`),
  fmt,
  hooks,
  flash: async ({
    _: [path = './dist/result.js'],
    persist,
    build,
    port,
    p,
    exitDuration,
  }) =>
    await new AllFlasher([
      espruino,
      new UnoFlasher(),
    ], exitDuration + "").flash(
      path + "",
      !!persist,
      p ?? port,
      build,
    ),
  host: () => sh(`node sketch/js/firmata/main.js`),
  build: ({ _: [name = "test"] }) => espruino.build(name + ""),
  tty: () => espruino.tty(),
  eval: ({ _: [code], wait }) => espruino.eval(code + "", wait + ""),
  list: async () => console.log((await espruino.ports()).join("\n")),
});
