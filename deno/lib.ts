import {
  Runner,
} from "https://raw.githubusercontent.com/zored/deno/v0.0.28/mod.ts";
import { exec, OutputMode } from "https://deno.land/x/exec@0.0.5/mod.ts";
const { mkdir, writeTextFile, lstat } = Deno;

type Port = string;
export class Espruino {
  iskraJsPort = async (): Promise<Port | undefined> =>
    (await this.ports()).find((s) => s.match(/usbmodem/) !== null);

  ports = async (): Promise<Port[]> =>
    (await this.list()).match(/(\/dev[^\s]+)/g) || [];

  upload = async (port: Port, file: string) => {
    if (!port) {
      throw new Error("No port specified.");
    }
    return await this.run(
      `--verbose --board ISKRAJS; -j --port ${port} ${file}`,
      true,
    );
  };

  private list = () => this.run("--list --no-ble");

  private run = async (args: string, showProgress = false) =>
    (await exec(
      `espruino/node_modules/.bin/espruino ${args}`,
      { output: showProgress ? OutputMode.Tee : OutputMode.Capture },
    )).output;
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
