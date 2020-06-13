import {HttpRetriever} from "../../std/HttpRetriever.ts"
import {IAnimation} from "../../shared/data/animation/IAnimation.ts"
import {LedsAnimation} from "./LedsAnimation.ts"

export class LedsHttpAnimation {
    constructor(private animator: LedsAnimation, private loopsBeforeUpdate = Infinity) {
    }

    static forPin = (pin: SpiMosiPin) => new LedsHttpAnimation(LedsAnimation.forPin(pin))

    load = async (loops = Infinity) => {
        for (; loops > 0; loops--) {
            const animation = await this.loadAnimation()
            await this.animator.run(animation, this.loopsBeforeUpdate)
        }
    }

    private loadAnimation = async (): Promise<IAnimation> => {
        try {
            const http = HttpRetriever.forActiveTransport()
            const body = await http.getBody(URL_ANIMATION)
            return JSON.parse(body)
        } catch (e) {
            console.log('could not get animation', e);
            return {frames: [{durationMs: 5000, colors: []}]}
        }
    }
}