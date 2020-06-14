import {IskraJs} from "../_lib/pin/IskraJs.ts"
import {PressureSensor} from "../_lib/device/sensor/PressureSensor.ts"
import {intervalsDetached} from "../_lib/std/intervals.ts"
import {StorageClient} from "../_lib/flow/client/StorageClient.ts"
import {WiFi} from "../_lib/device/WiFi.ts"
import {CO2Sensor} from "../_lib/device/sensor/CO2Sensor.ts"

(async () => {

    await WiFi.fromEnv().connect()

    const board = IskraJs.instance
    const barometer = new PressureSensor(board.getI2C())
    const co2Sensor = new CO2Sensor(
        board.getPin(A1),
        board.getPin(P12),
    )
    // const humiditySensor = new HumiditySensor(IskraJs.instance.getPin(P7))
    const storage = new StorageClient()
    const min5 = [5 * 1000 * 60]
    intervalsDetached([
        // [
        //     min5,
        //     async () => {
        //         const {humidity} = await humiditySensor.read()
        //         await storage.sendNumbers({humidity})
        //     },
        //     Infinity
        // ],
        [
            [10000],
            () => storage.sendNumbers({test: 1}),
            Infinity
        ],
        // [
        //     min5,
        //     async () => {
        //         const pressure = barometer.pressure()
        //         const temperature = barometer.temperature()
        //         console.log({temperature, pressure})
        //         await storage.sendNumbers({temperature, pressure})
        //     },
        //     Infinity
        // ],
        // [
        //     min5,
        //     async () => {
        //         const co2 = await co2Sensor.heatOnceAndRead()
        //         console.log({co2})
        //         await storage.sendNumbers({co2})
        //     },
        //     Infinity
        // ],
    ])
})()