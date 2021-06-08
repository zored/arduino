import {LedsFrame} from "../../_lib/flow/led/LedsFrame"
import {IskraJs} from "../../_lib/pin/IskraJs"

export function mainRed() {
    const f = LedsFrame.forSPI(IskraJs.instance.getSPI("P3"))
    f.clear()
    f.draw({
        colors: [
            ['#aa0000', '#aa0000', '#aa0000', '#aa0000'],
            ['#aa0000', '#aa0000', '#aa0000', '#aa0000'],
            ['#aa0000', '#aa0000', '#aa0000', '#aa0000'],
            ['#aa0000', '#aa0000', '#aa0000', '#aa0000'],
        ],
        durationMs: 100,
    })
}
