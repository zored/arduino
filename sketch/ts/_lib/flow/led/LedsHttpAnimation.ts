import {IAnimation} from "../../shared/data/animation/IAnimation.ts"
import {LedsAnimation} from "./LedsAnimation.ts"
import {StorageClient} from "../client/StorageClient.ts"

export class LedsHttpAnimation {
    constructor(
        private animator: LedsAnimation,
        private loopsBeforeUpdate = Infinity,
        private client = new StorageClient(),
    ) {
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
            return await this.client.getAny('led16')
        } catch (e) {
            console.log('could not get animation', e)
            return {frames: [{durationMs: 5000, colors: []}]}
        }
    }
}