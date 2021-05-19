import { __, exec, parseDuration, sh as doSh, shOut } from "../deps.ts";
import { fromRoot, IFlasher, Port, SketchPath } from "./all.ts";
import { delay } from "../sketch/ts/_lib/std/intervals.ts";

const { readTextFile, writeTextFile, realPath, remove } = Deno;
const { __dirname } = __(import.meta);

async function sh(command: string) {
  console.error({ command });
  await doSh(command);
}

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
    await remove(await fromRoot(path));
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
      path = this.getResultPath(buildName);
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

  private getResultPath = (name: string) => `dist/result_${name}.js`;

  private list = () => this.run("--list --no-ble");

  private run = async (
    args: string,
    showProgress = false,
  ): Promise<void | string> =>
    await (showProgress ? sh : shOut)(
      log(
        (await fromRoot("/node_modules/espruino/bin/espruino-cli.js")) + " " +
          args,
      ),
    );

  build = async (name: string) => {
    await Promise.all(
      ["dist/index.js", this.getResultPath(name)].map(removeIfExists),
    );
    await sh(`npx ncc build ./sketch/ts/${name}/index.ts`); // 👉 ./dist/index.js
    const result = `result_${name}.js`;
    await sh(
      `npx webpack --mode production --env.OUTPUT_FILENAME="${result}"`,
    ); // 👉 ./dist/result_name.js
    await this.replaceRequires(result);
  };

  private replaceRequires = async (result: string) => {
    const path = await fromRoot(`dist/${result}`);
    await Deno.writeTextFile(
      path,
      (await Deno.readTextFile(path))
        .replace(
          /eval\("require"\)\("/g,
          'require("',
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
