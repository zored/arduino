// Blink LED on body of Iskra.
import {IskraJs} from "../_lib/pin/IskraJs.ts"
import {addGlobals} from "../_lib/std/addGlobals.ts"
import {intervals} from "../_lib/std/intervals.ts"

const board = IskraJs.instance
// noinspection JSIgnoredPromiseFromCall
intervals([1000, 500, 500, 2000], () => board.getLed().toggle())
addGlobals({myIskra: board})
