import {InfraredTimeSensor} from "../_lib/device/sensor/InfraredTimeSensor.ts"
import {IskraJs} from "../_lib/pin/IskraJs.ts"
import {addGlobals} from "../_lib/std/addGlobals.ts"
import {SamsungTvRemote} from "../_lib/device/led/Infrared/SamsungTvRemote.ts"

const board = IskraJs.instance
const ir = new InfraredTimeSensor(board.getPin(P3))
const tv = SamsungTvRemote.forPins(
    board.getPin(A3),
    board.getPin(P6)
)

let stop = ir.watch()
addGlobals({
    r: () => {
        console.log({durations: stop()})
        stop = ir.watch()
    },
    p: () => tv.press('power'),
    v: () => tv.press('volumeUp'),
})