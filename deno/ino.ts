import {
  Runner,
} from "https://raw.githubusercontent.com/zored/deno/v0.0.28/mod.ts";
import { IFlasher, Port, SketchPath } from "./all.ts";
const { mkdir, writeTextFile, lstat } = Deno;

export class UnoFlasher implements IFlasher {
  suits = (path: SketchPath): boolean => /\/sketch\/ino\//.test(path);

  async flash(
    path: SketchPath,
    persist: boolean,
    port?: Port,
    buildName?: string,
  ): Promise<void> {
    if (/sketch\/Firmata$/.test(path)) {
      await new Firmata().download(path);
    } else if (path === "") {
      throw new Error("Specify sketch name.");
    }
    const sketch = new ArduinoSketch(`${path}`);
    await sketch.compile();
    await sketch.flash();
  }
}
export class ArduinoSketch {
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

export class Firmata {
  async download(name: string): Promise<void> {
    const dir = `sketch/${name}`;
    const file = `${dir}/${name}.ino`;
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
