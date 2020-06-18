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

const startMs = 12000

const firstMs = 4.6
const secondMs = 4.5
const longMs = 1.7
const shortMs = 0.6
const offsetMs = shortMs
const lastMs = 50

export class SamsungTvRemote {
    constructor(private ir: InfraredTransmitter) {
    }

    static forPins = (plus: AnalogPin, minus: DigitalPin) => new SamsungTvRemote(
        new InfraredTransmitter(plus, minus)
    )

    press = (button: Button, raw = false): void => this.ir.send(
        raw
            ? this.timesFromRaw(button)
            : this.timesFromCodes(button)
    )

    private timesFromCodes = (button: Button): Times => [
        firstMs,
        ...codes[button]
            .split('')
            .flatMap((c, i): Times => [
                c === '1'
                    ? (i === 0 ? secondMs : longMs)
                    : shortMs,
                offsetMs,
            ]),
        lastMs,
    ]

    private timesFromRaw = (button: Button): Times => this.buttons()[button]

    private buttons = (): Record<Button, Times> => buttons as any

}