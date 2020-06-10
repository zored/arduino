import { __, exec, sh, shOut, parseDuration } from "../deps.ts";
import { fromRoot, IFlasher, Port, SketchPath } from "./all.ts";
import { delay } from "../sketch/ts/_lib/std/intervals.ts";

const { readTextFile, writeTextFile, realPath, remove } = Deno;
const { __dirname } = __(import.meta);

interface IJobPort {
  type: "path";
  name: string;
}
interface IJob {
  ports: IJobPort[];
  file: string;
  espruino: {
    /**
     *
     */
    SAVE_ON_SEND: 0 | 1 | 2 | 3;
  };
}

const removeIfExists = async (path: string) => {
  try {
    await remove(path);
  } catch (e) {
  }
};
const log = <T>(a: T): T => {
  console.log(a);
  return a;
};

export class Espruino implements IFlasher {
  private hasTty = false;
  constructor(private verbose = false) {
  }
  iskraJsPort = async (): Promise<Port | undefined> =>
    (await this.ports()).find((s) => s.match(/usbmodem/) !== null);

  ports = async (): Promise<Port[]> =>
    ((await this.list()) + "").match(/(\/dev[^\s]+)/g) || [];

  async flash(
    path: SketchPath,
    persist: boolean,
    port?: Port,
    buildName?: string,
  ): Promise<void> {
    if (buildName) {
      await this.build(buildName);
    }
    // noinspection ES6MissingAwait (flash requires open tty)
    this.tty(port);

    port = await this.getPort(port);
    if (!port) {
      throw new Error("Could not find board port.");
    }
    const jobFile = await this.getJobFile(path, port, persist);
    await this.run(
      `${
        this.verbose ? "--verbose " : ""
      }--no-ble --port ${port} -j ${jobFile}`,
      true,
    );
  }

  suits = (path: SketchPath): boolean => /\.js$/.test(path);

  private getJobFile = async (
    sketch: SketchPath,
    port: Port,
    persist: boolean,
  ) => {
    const job: IJob = JSON.parse(
      await readTextFile(await fromRoot("sketch/ts/_config/job.json")),
    );
    job.ports.push({ type: "path", name: port });
    job.file = sketch;
    job.espruino.SAVE_ON_SEND = persist ? 1 : 0;
    const jobPath = await fromRoot("dist/job.json");
    await writeTextFile(jobPath, JSON.stringify(job, null, 2));
    return jobPath;
  };

  private list = () => this.run("--list --no-ble");

  private run = async (
    args: string,
    showProgress = false,
  ): Promise<void | string> =>
    await (showProgress ? sh : shOut)(
      log((await fromRoot("/node_modules/.bin/espruino")) + " " + args),
    );

  build = async (name: string) => {
    await removeIfExists(await fromRoot("dist/index.js"));
    await exec(`npx ncc build ./sketch/ts/${name}/index.ts`); // 👉 ./dist/index.js
    await exec(`npx webpack --mode production`); // 👉 ./dist/result.js
    await this.replaceRequires();
  };

  private replaceRequires = async () => {
    const path = await fromRoot("dist/result.js");
    await Deno.writeTextFile(
      path,
      (await Deno.readTextFile(path))
        .replace(
          /eval\("require"\)\("@amperka/g,
          'require("@amperka',
        ),
    );
  };

  eval = async (s: string, wait: string) => {
    this.tty();
    await delay(100);
    await this.run(`-e ${s}`, true);
    await delay(parseDuration(wait));
  };

  tty = async (port?: Port) => {
    if (this.hasTty) {
      return;
    }
    this.hasTty = true;
    return await sh(`minicom -b 9600 -D ${await this.getPort(port)}`);
  };

  private getPort = async (port?: Port): Promise<Port | undefined> =>
    port ?? await this.iskraJsPort();
}
