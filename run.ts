#!/usr/bin/env -S deno run --allow-write --allow-read --allow-net --allow-run
import {
  assertAllTracked,
  CommandArgs,
  GitHooks,
  runCommands,
  sh,
} from "./deps.ts";
import { Espruino } from "./deno/ts.ts";
import { AllFlasher } from "./deno/all.ts";
import { UnoFlasher } from "./deno/ino.ts";

const fmt = async (args: CommandArgs) => {
  await sh(`deno fmt ${args.c ? "--check " : ""}./run.ts ./deno`);
  await sh(
    `yarn tslint -c tslint.json ./sketch/ts/**/*.ts${args.c ? "" : " --fix"}`,
  );
};

const gitHooks = new GitHooks({
  "pre-commit": async () => {
    await assertAllTracked();
    await fmt({ c: 1, _: [] });
    await sh("yarn test");
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
  pins: async ({ _: [x], f = "USART", t = "TX" }) => {
    const pins: any = JSON.parse(
      await Deno.readTextFile("sketch/ts/_config/types/pins.json"),
    );

    switch (x) {
      case "uart":
        console.log(
          Object
            .entries(pins)
            .map(([pinId, pin]) => {
              const [fnId, v] = Object
                .entries((pin as any).functions)
                .find(([n]) => n.match(/USART\d+/)) ?? [];
              if (!v) {
                return null;
              }
              return [pinId, fnId, (v as any).type];
            })
            .filter((v): v is [string, string, string] => v !== null)
            .sort((a, b) => a[2].localeCompare(b[2]))
            .reduce((a, [pin, fnId, type]) => {
              const fn = a[fnId] ?? {};
              fn[type] = pin;
              a[fnId] = fn;
              return a;
            }, {} as Record<string, Record<string, string>>),
        );
        return;
    }
    console.log(
      `Pins with function "${f}" and type "${t}".`,
      Object
        .entries(pins)
        .filter(([, pin]) =>
          Object.entries((pin as any).functions).some(([name, v]) =>
            (v as any)["type"] === t
          )
        )
        .map(([name]) => name),
    );
  },
  led16: async ({ _: [url, name] }) => {
    const dir = "./sketch/ts/led16/config";
    if (!name) {
      const names: string[] = [];
      for await (const { name } of Deno.readDir(dir)) {
        names.push(name.replace(/.json$/, ""));
      }
      console.log(JSON.stringify({ names }));
      return;
    }
    const path = `${dir}/${name}.json`;
    const text = JSON.stringify(
      JSON.parse(
        await Deno.readTextFile(path),
      ),
    );
    const response = await fetch(url + "", {
      method: "POST",
      body: new TextEncoder().encode(text),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await response.json();
    console.log(JSON.stringify({ path, url, ok: true, responseJson }));
  },
});
