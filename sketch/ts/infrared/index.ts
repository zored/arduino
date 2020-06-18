import {IskraJs} from "../_lib/pin/IskraJs.ts"
import {addGlobals} from "../_lib/std/addGlobals.ts"
import {Button, SamsungTvRemote} from "../_lib/device/led/Infrared/SamsungTvRemote.ts"
import {InfraredCodeSensor} from "../_lib/device/sensor/InfraredCodeSensor.ts"

const board = IskraJs.instance
const tv = SamsungTvRemote.forPins(
    board.getPin(A3),
    board.getPin(P6)
);
const sensor = new InfraredCodeSensor(
    board.getPin(P3)
);

(async () => {
    while (true) {
        const code = await sensor.getCode()
        console.log({code})
    }
})()
const r = () => console.log('no reset required')

addGlobals({
    p: (b: Button) => tv.press(b),
})