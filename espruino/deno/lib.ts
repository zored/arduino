import { exec, OutputMode, __ } from "../../deps.ts";
const { readTextFile, writeTextFile } = Deno;
const { __dirname } = __(import.meta);
type Port = string;
type SketchPath = string;

interface IJobPort {
  type: "path";
  name: string;
}
interface IJob {
  ports: IJobPort[];
  file: string;
}

const getPath = (relative: string) => __dirname + "/../" + relative;

export class Espruino {
  iskraJsPort = async (): Promise<Port | undefined> =>
    (await this.ports()).find((s) => s.match(/usbmodem/) !== null);

  ports = async (): Promise<Port[]> =>
    (await this.list()).match(/(\/dev[^\s]+)/g) || [];

  upload = async (port: Port, sketch: SketchPath) => {
    if (!port) {
      throw new Error("No port specified.");
    }
    const jobFile = await this.getJobFile(sketch, port);
    return await this.run(
      `--verbose --no-ble --port ${port} -j ${jobFile}`,
      true,
    );
  };

  private getJobFile = async (sketch: SketchPath, port: Port) => {
    const job: IJob = JSON.parse(await readTextFile(getPath("job.json")));
    job.ports.push({ type: "path", name: port });
    job.file = sketch;
    const jobPath = getPath("last_job.json");
    await writeTextFile(jobPath, JSON.stringify(job, null, 2));
    return jobPath;
  };

  private list = () => this.run("--list --no-ble");

  private run = async (args: string, showProgress = false) =>
    (await exec(
      getPath("/node_modules/.bin/espruino") + " " + args,
      { output: showProgress ? OutputMode.Tee : OutputMode.Capture },
    )).output;
}