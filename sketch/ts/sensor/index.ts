import {HumidityTemperatureSensor} from "../_lib/device/sensor/HumidityTemperatureSensor.ts"
import {IskraJs} from "../_lib/pin/IskraJs.ts"

(async () => {
    const board = IskraJs.instance
    board.resetPublic()
    const sensor = new HumidityTemperatureSensor(board.getPin(P7))
    while (true) {
        const {temperature, humidity} = await sensor.read()
        console.log(`Temperature: ${temperature}, humidity: ${humidity}.`)
    }
})()