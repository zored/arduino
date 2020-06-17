import {IskraJs} from "../_lib/pin/IskraJs.ts"
import {addGlobals} from "../_lib/std/addGlobals.ts"
import {SamsungTvRemote} from "../_lib/device/led/Infrared/SamsungTvRemote.ts"
import {InfraredCodeSensor} from "../_lib/device/sensor/InfraredCodeSensor.ts"

const board = IskraJs.instance
const tv = SamsungTvRemote.forPins(
    board.getPin(A3),
    board.getPin(P6)
)

const sensorPin = board.getPin(P3)
// const sensor = new InfraredTimeSensor(sensorPin)
// let stop = sensor.watch()
// const r = () => {
//     console.log({durations: stop()})
//     stop = sensor.watch()
// }

const sensor = new InfraredCodeSensor(sensorPin);
(async () => {
    while (true) {
        const code = await sensor.getCode()
        console.log({code});
    }
})()
const r = () => console.log('no reset required');

addGlobals({
    r,
    p: () => tv.press('power'),
    p2: () => tv.press2('power'),
    v: () => tv.press('volumeUp'),
    v2: () => tv.press2('volumeUp'),
})