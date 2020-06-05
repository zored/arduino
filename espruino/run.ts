#!/usr/bin/env -S deno run --allow-write --allow-read --allow-net --allow-run --quiet
import { Espruino } from "./deno/lib.ts";
import { runCommands } from "../deps.ts";

const espruino = new Espruino();
runCommands({
  upload: async ({ _: [file], p }) =>
    console.log(
      await espruino.upload(
        p ?? (await espruino.iskraJsPort() ?? "") + "",
        file + "",
      ),
    ),
  ports: async () => console.log((await espruino.ports()).join("\n")),
});
