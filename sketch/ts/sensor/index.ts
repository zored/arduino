import {IskraJs} from "../_lib/pin/IskraJs.ts"
import {intervalsDetached} from "../_lib/std/intervals.ts"
import {StorageClient} from "../_lib/flow/client/StorageClient.ts"
import {WiFi} from "../_lib/device/WiFi.ts"
import {getPressure} from "./impl/pressure.ts"
import {getCO2} from "./impl/co2.ts"

export const min5: number[] = [5 * 60 * 1000];

(async () => {
    await WiFi.fromEnv().connect()
    const board = IskraJs.instance
    const storage = new StorageClient()
    intervalsDetached([
        getPressure(storage, board),
        getCO2(storage, board),
    ])
})()