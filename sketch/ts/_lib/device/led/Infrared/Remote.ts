import {InfraredTransmitter} from "./InfraredTransmitter.ts"
import * as devices from "./devices.json"
import {Times} from "../../sensor/InfraredTimeSensor.ts"
import {delay} from "../../../std/intervals.ts"
import {BitString} from "../../sensor/InfraredCodeSensor.ts"

export type Button = string

const startMs = 12000

const firstMs = 4.6
const firstLongMs = 4.5
const defaultLongMs = 1.7
const shortMs = 0.6
const offsetMs = shortMs
const lastMs = 50

const maxVolume = 20
const pressInterval = lastMs

type Codes = Record<Button, BitString>

export class Remote {
    private codesByButton: Codes

    constructor(private ir: InfraredTransmitter, name: string = 'samsungTv') {
        this.codesByButton = (devices as any)[name] as Codes
    }

    static forPins = (plus: AnalogPin, minus: DigitalPin) => new Remote(
        new InfraredTransmitter(plus, minus)
    )

    press = (button: Button, raw = false): void => this.ir.send(
        !raw
            ? this.timesFromCodes(button)
            : this.timesFromRaw(button)
    )

    setVolume = async (v: number): Promise<void> => {
        await this.repeatPress('volumeDown', maxVolume)
        await this.repeatPress('volumeUp', v)
    }

    private repeatPress = async (b: Button, n: number) => {
        for (let i = 0; i < n; i++) {
            this.press(b)
            await delay(pressInterval)
        }
    }

    private resetVolume = async () => {
        for (let i = 0; i < maxVolume; i++) {
            this.press('volumeDown')
            await delay(pressInterval)
        }
    }

    private timesFromCodes = (button: Button): Times =>
        [firstMs, ...this.getTimes(button), lastMs]

    private getTimes(button: Button) {
        const times = this.codesByButton[button]
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