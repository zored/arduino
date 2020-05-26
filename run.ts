#!/usr/bin/env -S deno run --allow-write --allow-read --allow-net --allow-run --quiet
import { Args } from "https://deno.land/std/flags/mod.ts";
import {
  Info,
  Commands,
  GitHooks,
  Runner,
} from "https://raw.githubusercontent.com/zored/deno/v0.0.18/mod.ts";
const { mkdir, writeTextFile, lstat } = Deno;
const fmt = () => new Runner().run(`deno fmt ./run.ts`);

const gitHooks = new GitHooks({
  "pre-commit": fmt,
});
const hooks = (args: Args) => gitHooks.run(args);

const commands = new Commands({
  fmt,
  hooks,
  flash: async () => {
    await new Firmata().download();
    const sketch = new ArduinoSketch(Firmata.sketch);
    await sketch.compile();
    await sketch.flash();
  },
  run: async () => await new Runner().run(`node js/main.js`),
});

class ArduinoSketch {
  private readonly board = "arduino:avr:uno";
  private readonly port = "/dev/cu.usbmodem144101";
  private readonly runner = new Runner();

  constructor(private sketch: string) {}

  async compile(): Promise<void> {
    await this.run(`compile ${this.sketch}`);
  }
  async flash(): Promise<void> {
    await this.run(`upload -p ${this.port} ${this.sketch}`);
  }

  private async run(cmd: string): Promise<void> {
    return await this.runner.run(`arduino-cli ${cmd} -b ${this.board}`);
  }
}

class Firmata {
  public static readonly sketch = "sketch/StandardFirmata";
  async download(): Promise<void> {
    const dir = Firmata.sketch;
    const file = `${dir}/StandardFirmata.ino`;
    const exists = async (f: string) => {
      try {
        await lstat(file);
        return true;
      } catch (e) {
        return false;
      }
    };
    if (await exists(file)) {
      return;
    }
    const response = await fetch(
      `https://raw.githubusercontent.com/firmata/arduino/v2.4.4/examples/StandardFirmata/StandardFirmata.ino`,
    );
    const text = await response.text();
    await mkdir(dir, { recursive: true });
    await writeTextFile(file, text);
  }
}

await commands.runAndExit();
