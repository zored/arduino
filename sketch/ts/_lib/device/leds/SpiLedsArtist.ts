import {Point} from "../../shared/Point.ts"
import {Color} from "../../shared/Color.ts"
import {ILedsArtist} from "./ILedsArtist.ts"

const AmperkaLedStrip = require('@amperka/led-strip') as AmperkaLedStripFactory

export class SpiLedsArtist implements ILedsArtist {
    private strip?: ILedStrip

    /**
     * @param spi - only MOSI is required.
     * @param side
     * @param brightness
     */
    constructor(
        private spi: SPI,
        private side = 4,
        private brightness = 0.01,
    ) {
    }

    setColor = (point: Point, color: Color): void =>
        this.getStrip().putColor(
            point.toIndex(this.side),
            color.toGRB1()
        )

    clear = () => this.getStrip().clear()
    apply = () => this.getStrip().apply()

    private getStrip = () =>
        this.strip = this.strip ?? this.createStrip()

    private createStrip(): ILedStrip {
        this.spi.setup({
            baud: 3200000
        })
        const strip = AmperkaLedStrip.connect(
            this.spi,
            this.side * this.side,
            'RGB',
        )
        strip.brightness(this.brightness)
        return strip
    }
}
