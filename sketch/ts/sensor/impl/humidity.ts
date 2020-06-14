import {StorageClient} from "../../_lib/flow/client/StorageClient.ts"
import {IskraJs} from "../../_lib/pin/IskraJs.ts"
import {HumiditySensor} from "../../_lib/device/sensor/HumiditySensor.ts"
import {min5} from "../index.ts"
import {IntervalsParams} from "../../_lib/std/intervals.ts"

export const getHumidity = (storage: StorageClient, board: IskraJs): IntervalsParams => {
    const humiditySensor = new HumiditySensor(board.getPin(P7))
    return [
        min5,
        async () => {
            const {humidity} = await humiditySensor.read()
            await storage.sendNumbers({humidity})
        },
        Infinity
    ]
}