import {PinContainer} from "./PinContainer"
import {Led} from "../device/Led.ts"

export class IskraJs {
    static instance = new IskraJs()
    private led?: Led

    private constructor(private pins = new PinContainer()) {
    }

    getLed = (): Led =>
        this.led = this.led ??
            new Led(this.pins.output(B6))

    getPin = <T extends DigitalPin>(pin: T) => this.pins.output(pin)

    allPins = () => {
        const pins: Record<string, Pin> = {}
        const add = (name: string) => pins[name] = global[name];

        for (let P = 0; P <= 13; P++) {
            add(`P${P}`);
        }
        for (let A = 0; A <= 15; A++) {
            add(`A${A}`)
        }

        ['SCA', 'SDA', 'LED1', 'LED2'].forEach(add)

        return pins
    }
}
