import {PinContainer} from "./PinContainer"
import {Led} from "../device/Led.ts"

export class IskraJs {
    private led?: Led

    constructor(private pins = new PinContainer()) {
    }

    getLed = (): Led =>
        this.led = this.led ??
            new Led(this.pins.output(B6))
}
