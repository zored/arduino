import {LedsFrame} from "./LedsFrame.ts"
import {IAnimation} from "../../shared/data/animation/IAnimation.ts"
import {delay} from "../../std/intervals.ts"
import {PinLeds} from "../../device/leds/PinLeds.ts"
import {SpiLeds} from "../../device/leds/SpiLeds.ts"

export class LedsAnimation {
    private version = 0

    private constructor(private readonly frame: LedsFrame) {
    }

    static forPin = (pin: SpiMosiPin) => new LedsAnimation(new LedsFrame(new PinLeds(pin)))
    static forSPI = (spi: SPI) => new LedsAnimation(new LedsFrame(SpiLeds.forSPI(spi)))

    run = (animation: IAnimation, loops = Infinity) => new Promise((resolve, reject) => {
        this.version++
        const frames = animation.frames
        const render = async (index: number, version: number, loop: number) => {
            if (frames.length === index) {
                index = 0
                loop--
            }
            if (this.version !== version || loop === 0) {
                this.stop();
                resolve()
                return
            }
            const frame = frames[index]
            this.frame.draw(frame)
            await delay(frame.durationMs)
            // noinspection ES6MissingAwait
            render(index + 1, version, loop)
        }
        // noinspection JSIgnoredPromiseFromCall
        render(0, this.version, loops)
    })

    stop = () => {
        this.version = 0
        this.frame.clear()
    }
}