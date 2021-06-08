import {LedsFrame} from "./LedsFrame.ts"
import {IAnimation} from "../../shared/data/animation/IAnimation.ts"
import {intervals} from "../../std/intervals.ts"

export class LedsAnimation {
    private version = 0

    constructor(private readonly frame: LedsFrame) {
    }

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
