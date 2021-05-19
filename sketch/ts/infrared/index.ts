import {IskraJs} from "../_lib/pin/IskraJs.ts"
import {addGlobals} from "../_lib/std/addGlobals.ts"
import {InfraredCodeSensor} from "../_lib/device/sensor/InfraredCodeSensor.ts"

const board = IskraJs.instance
// const o = Remote.forPins(
//     board.getPin(A3),
//     board.getPin(P6)
// )
const o = new InfraredCodeSensor(P3)
addGlobals({o})
