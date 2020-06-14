import {StorageClient} from "../../_lib/flow/client/StorageClient.ts"
import {IskraJs} from "../../_lib/pin/IskraJs.ts"
import {PressureSensor} from "../../_lib/device/sensor/PressureSensor.ts"
import {min5} from "../index.ts"
import {IntervalsParams} from "../../_lib/std/intervals.ts"

export const getPressure = (storage: StorageClient, board: IskraJs): IntervalsParams => {
    const pressureSensor = new PressureSensor(board.getI2C())
    return [
        min5,
        async () => {
            const pressure = await pressureSensor.pressure()
            const temperature = await pressureSensor.temperature()
            console.log({temperature, pressure})
            await storage.sendNumbers({temperature, pressure})
        },
        Infinity
    ]
}