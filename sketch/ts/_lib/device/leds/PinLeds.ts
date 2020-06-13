import {PinLedsArtist} from "./PinLedsArtist.ts"
import {ILedsArtist} from "./ILedsArtist.ts"
import {ILeds} from "./ILeds.ts"

const NeoPixel = require("neopixel")

export class PinLeds implements ILeds {
    constructor(private pin: SpiMosiPin, private artist = new PinLedsArtist()) {
    }

    draw(f: (artist: ILedsArtist) => void) {
        f(this.artist)
        this.flush()
    }

    private flush = () => NeoPixel.write(this.pin, this.artist.getCanvas())
}