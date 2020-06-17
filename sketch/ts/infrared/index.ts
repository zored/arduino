import {InfraredTimeSensor} from "../_lib/device/sensor/InfraredTimeSensor.ts"
import {IskraJs} from "../_lib/pin/IskraJs.ts"
import {addGlobals} from "../_lib/std/addGlobals.ts"

const ir = new InfraredTimeSensor(IskraJs.instance.getPin(P3))
let stop = ir.watch()
addGlobals({
    restart() {
        console.log({durations: stop()})
        stop = ir.watch()
    }
})