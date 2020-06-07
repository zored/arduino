// Blink LED on body of Iskra.
import {IskraJs} from "../_lib/pin/IskraJs"
import {addGlobals} from "../_lib/std/addGlobals"
import {intervals} from "../_lib/std/intervals.ts"

const iskra = new IskraJs()
// noinspection JSIgnoredPromiseFromCall
intervals([1000, 500, 500, 2000], () => iskra.getLed().toggle())
addGlobals({iskra})
