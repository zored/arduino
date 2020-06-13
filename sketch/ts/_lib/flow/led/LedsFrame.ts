import {IFrame} from "../../shared/data/animation/IFrame.ts"
import {Point} from "../../shared/Point.ts"
import {Color} from "../../shared/Color.ts"
import {ILeds} from "../../device/leds/ILeds.ts"

export class LedsFrame {
    constructor(private leds: ILeds) {
    }

    draw = (frame: IFrame): void =>
        this.leds.draw(a => frame.colors.forEach((row, y) =>
            row.forEach((color, x) =>
                a.setColor(
                    new Point(x, y),
                    Color.fromHex(color)
                )
            )
        ))

    clear = () => this.leds.draw(a => a.clear())
}