import {IskraJs} from "../_lib/pin/IskraJs.ts"
import {WiFi} from "../_lib/device/WiFi.ts"
import {LedsHttpAnimation} from "../_lib/flow/led/LedsHttpAnimation.ts"
import {wrapLogs} from "../_lib/std/log.ts"
import {LedsAnimation} from "../_lib/flow/led/LedsAnimation.ts"

(async () => {
    const board = IskraJs.instance
    const wifi = WiFi.fromEnv(board.getUART("P1"))
    const animator = LedsAnimation.forSPI(board.getSPI("P3"))
    animator.stop()
    await wrapLogs(wifi.connect(), 'connecting', 'connected')
    try {
        const animation = new LedsHttpAnimation(animator, 2)
        await wrapLogs(animation.load(), 'loading', 'loaded')
    } catch (e) {
        console.log('loading failed', e)
    }
})()