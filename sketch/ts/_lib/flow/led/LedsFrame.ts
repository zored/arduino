import {IFrame} from "../../shared/data/animation/IFrame.ts"
import {Point} from "../../shared/Point.ts"
import {Color} from "../../shared/Color.ts"
import {ILeds} from "../../device/led/leds/ILeds.ts"
import {PinLeds} from "../../device/led/leds/PinLeds.ts"
import {SpiLeds} from "../../device/led/leds/SpiLeds.ts"

export class LedsFrame {
    private constructor(private leds: ILeds) {
    }

    static forPin = (pin: SpiMosiPin) => new LedsFrame(new PinLeds(pin))
    static forSPI = (spi: SPI) => new LedsFrame(SpiLeds.forSPI(spi))

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
