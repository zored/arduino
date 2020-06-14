import {LedsFrame} from "./LedsFrame.ts"
import {IAnimation} from "../../shared/data/animation/IAnimation.ts"
import {intervals} from "../../std/intervals.ts"
import {PinLeds} from "../../device/leds/PinLeds.ts"
import {SpiLeds} from "../../device/leds/SpiLeds.ts"

export class LedsAnimation {
    private version = 0

    private constructor(private readonly frame: LedsFrame) {
    }

    static forPin = (pin: SpiMosiPin) => new LedsAnimation(new LedsFrame(new PinLeds(pin)))
    static forSPI = (spi: SPI) => new LedsAnimation(new LedsFrame(SpiLeds.forSPI(spi)))

    run = async (animation: IAnimation, loops = Infinity) => {
        this.version++
        const initialVersion = this.version
        await intervals(
            animation.frames.map(f => f.durationMs),
            (i) => {
                if (this.version !== initialVersion) {
                    return false
                }
                this.frame.draw((animation.frames)[i])
            },
            loops
        )
    }

    stop = () => {
        this.version = 0
        this.frame.clear()
    }
}