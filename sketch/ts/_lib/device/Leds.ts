import {LedsArtist} from "./LedsArtist.ts"
const NeoPixel = require("neopixel");

export class Leds {
    constructor(private pin: DigitalPin, private artist = new LedsArtist()) {
    }

    draw(f: (artist: LedsArtist) => void) {
        f(this.artist)
        this.flush()
    }

    private flush = () => NeoPixel.write(this.pin, this.artist.getCanvas())
}