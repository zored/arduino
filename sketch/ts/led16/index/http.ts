import {IskraJs} from "../../_lib/pin/IskraJs"
import {WiFi} from "../../_lib/device/WiFi"
import {LedsHttpAnimation} from "../../_lib/flow/led/LedsHttpAnimation"
import {wrapLogs} from "../../_lib/std/log"
import {LedsAnimation} from "../../_lib/flow/led/LedsAnimation"
import {LedsFrame} from "../../_lib/flow/led/LedsFrame"

export async function mainHttp() {
    const board = IskraJs.instance
    const wifi = WiFi.fromEnv(board.getUART("P1"))
    const animator = new LedsAnimation(LedsFrame.forSPI(board.getSPI("P3")))
    animator.stop()
    await wrapLogs(wifi.connect(), 'connecting', 'connected')
    try {
        const animation = new LedsHttpAnimation(animator, 2)
        await wrapLogs(animation.load(), 'loading', 'loaded')
    } catch (e) {
        console.log('loading failed', e)
    }
}
