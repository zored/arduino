import {InfraredTransmitter} from "./InfraredTransmitter.ts"
import * as buttons from "./samsung.json"
import {BitString} from "../../sensor/InfraredCodeSensor.ts"
import {Times} from "../../sensor/InfraredTimeSensor.ts"

export type Button = 'power' | 'volumeUp' | 'nextChannel' | 'hdmi'

const codes: Record<Button, BitString> = {
    power: "111100000111000000100000010111111",
    volumeUp: "0111100000111000001101000000101111",
    nextChannel: "",
    hdmi: "",
}

const startMs = 12000;

const lowMs = 1

export class SamsungTvRemote {
    constructor(private ir: InfraredTransmitter) {
    }

    static forPins = (plus: AnalogPin, minus: DigitalPin) => new SamsungTvRemote(
        new InfraredTransmitter(plus, minus)
    )

    press = (button: Button, raw = true): void => this.ir.send(
        raw
            ? this.timesFromRaw(button)
            : this.timesFromCodes(button)
    )

    private timesFromCodes = (button: Button): Times => codes[button]
        .split('')
        .flatMap((c): Times => [
            this.getBitMs(c === '1'),
            lowMs,
        ])

    private timesFromRaw = (button: Button): Times => this.buttons()[button]

    private buttons = (): Record<Button, Times> => buttons as any

    private getBitMs = (v: boolean) => v
        ? 1.6
        : 0.5
}