import { __, parseDuration } from "../deps.ts";
import { delay } from "../sketch/ts/_lib/std/intervals.ts";

/**
 * Board port. Depends on specific board. Can be TTY, bluetooth, TCPIP, etc.
 */
export type Port = string;
export type SketchPath = string;

const { realPath } = Deno;
const { __dirname } = __(import.meta);

export const fromRoot = (relative: string) =>
  realPath(__dirname + "/../" + relative);

export interface IFlasher {
  flash(
    path: SketchPath,
    persist: boolean,
    port?: Port,
    buildName?: string,
  ): Promise<void>;

  suits(path: SketchPath): boolean;
}

export class AllFlasher implements IFlasher {
  constructor(private flashers: IFlasher[], private exitDuration = "") {
  }

  async flash(
    path: SketchPath,
    persist: boolean,
    port?: Port,
    buildName?: string,
  ): Promise<void> {
    const flasher = this.flashers.find((f) => f.suits(path));
    if (!flasher) {
      throw new Error(`No flasher found for path: ${path}.`);
    }
    await flasher.flash(path, persist, port, buildName);
    await delay(parseDuration(this.exitDuration));
  }

  suits(path: SketchPath): boolean {
    return true;
  }
}
