import {InfraredTransmitter} from "./InfraredTransmitter.ts"
import * as buttons from "./samsung.json"
import {Times} from "../../sensor/InfraredTimeSensor.ts"
import {BitString} from "../../sensor/InfraredCodeSensor.ts"

export type Button = 'power' | 'volumeUp' | 'volumeDown' | 'nextChannel' | 'hdmi' | 'prevChannel'

const codes: Record<Button, BitString> = {
    power: "111100000111000000100000010111111",
    volumeUp: "0111100000111000001101000000101111",
    volumeDown: "111100000111000001101000000101111",
    nextChannel: "111100000111000000100100010110111",
    prevChannel: "111100000111000000000100011110111",
    hdmi: "11110000011100000110100010010111",
}

const startMs = 12000

const firstMs = 4.6
const firstLongMs = 4.5
const defaultLongMs = 1.7
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
        !raw
            ? this.timesFromCodes(button)
            : this.timesFromRaw(button)
    )

    private timesFromCodes = (button: Button): Times =>
        [firstMs, ...this.getTimes(button), lastMs]

    private getTimes(button: Button) {
        const times = codes[button]
            .split('')
            .flatMap((active): Times => [
                active === '1' ? defaultLongMs : shortMs,
                offsetMs,
            ])
        const firstLong = times.indexOf(defaultLongMs)
        times[firstLong] = firstLongMs
        return times
    }

    private timesFromRaw = (button: Button): Times => this.buttons()[button]

    private buttons = (): Record<Button, Times> => buttons as any

}