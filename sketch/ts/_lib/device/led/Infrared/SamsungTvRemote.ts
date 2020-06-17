import {InfraredTransmitter} from "./InfraredTransmitter.ts"
import * as buttons from "./samsung.json"

export type Button = 'power' | 'volumeUp'

export class SamsungTvRemote {
    constructor(private ir: InfraredTransmitter) {
    }

    static forPins = (plus: AnalogPin, minus: DigitalPin) => new SamsungTvRemote(
        new InfraredTransmitter(plus, minus)
    )

    press = (button: Button): void => this.ir.send(this.buttons()[button] as number[])

    buttons = (): Record<Button, number[]> => buttons as any
}