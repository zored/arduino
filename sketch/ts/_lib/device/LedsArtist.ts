import {Point} from "../shared/Point.ts"
import {Color} from "../shared/Color.ts"

type Pixels = Uint8ClampedArray

export class LedsArtist {
    private pixels: Pixels

    constructor(private side = 4, private brightness = 0.01) {
        this.pixels = this.createPixels()
    }

    setColor = (point: Point, color: Color): void =>
        color
            .toGRB255()
            .forEach((component, i) =>
                this.pixels[point.toIndex(this.side) * 3 + i] =
                    component * this.brightness
            )

    clear = () => this.pixels = this.createPixels()

    private createPixels = () => new Uint8ClampedArray(Math.pow(this.side, 2) * 3)

    getCanvas = () => this.pixels
}