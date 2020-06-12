import {LedsFrame} from "./LedsFrame.ts"
import {IAnimation} from "../../shared/data/animation/IAnimation.ts"
import {delay} from "../../std/intervals.ts"
import {Leds} from "../../device/Leds.ts"

export class LedsAnimation {
    private active = true

    private constructor(private readonly artist: LedsFrame) {
    }

    static forPin = (pin: DigitalPin) => new LedsAnimation(new LedsFrame(new Leds(pin)))

    start(animation: IAnimation): void {
        this.active = true
        const frames = animation.frames
        const render = async (index: number) => {
            if (!this.active) {
                return
            }
            if (frames.length === index) {
                index = 0
            }
            const frame = frames[index]
            this.artist.draw(frame)
            await delay(frame.durationMs)
            // noinspection ES6MissingAwait
            render(index + 1)
        }
        // noinspection JSIgnoredPromiseFromCall
        render(0)
    }

    stop = () => this.active = false
}