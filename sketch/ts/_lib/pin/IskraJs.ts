import {PinContainer} from "./PinContainer"
import {Led} from "../device/Led.ts"

export class IskraJs {
    private led?: Led

    static instance = new IskraJs()

    private constructor(private pins = new PinContainer()) {
    }

    getLed = (): Led =>
        this.led = this.led ??
            new Led(this.pins.output(B6))

    getPin = <T extends DigitalPin>(pin: T) => this.pins.output(pin)
}
