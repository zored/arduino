// Blink LED on body of Iskra.
import {IskraJs} from "../_lib/pin/IskraJs"
import {addGlobals} from "../_lib/std/addGlobals"

const iskra = new IskraJs()
setInterval(() => iskra.getLed().toggle(), 2000)
addGlobals({myIskra: iskra})
