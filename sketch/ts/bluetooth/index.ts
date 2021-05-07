import {BluetoothDevice} from "../_lib/device/BluetoothDevice.ts"
import {addGlobals} from "../_lib/std/addGlobals.ts"

(async () => {
    const bt = await new BluetoothDevice()
        .listen(d => console.log('got data', d))
    addGlobals({bt})
})()