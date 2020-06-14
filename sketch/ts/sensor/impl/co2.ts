import {StorageClient} from "../../_lib/flow/client/StorageClient.ts"
import {IskraJs} from "../../_lib/pin/IskraJs.ts"
import {CO2Sensor} from "../../_lib/device/sensor/CO2Sensor.ts"
import {min5} from "../index.ts"
import {IntervalsParams} from "../../_lib/std/intervals.ts"

export const getCO2 = (storage: StorageClient, board: IskraJs): IntervalsParams => {
    const sensor = new CO2Sensor(
        board.getPin(A1),
        board.getPin(P12),
    )

    return [
        min5,
        async () => {
            const co2 = await sensor.heatOnceAndRead()
            console.log({co2})
            await storage.sendNumbers({co2})
        },
        Infinity
    ]
}