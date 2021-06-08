import {Point} from "../../../shared/Point.ts"
import {Color} from "../../../shared/Color.ts"
import {ILedsArtist} from "./ILedsArtist.ts"

type Pixels = Uint8ClampedArray

export class PinLedsArtist implements ILedsArtist {
    private pixels: Pixels

    constructor(private side = 4, private brightness = 0.1) {
        this.pixels = this.createPixels()
    }

    setColor = (point: Point, color: Color): void =>
        color
            .multiply(this.brightness)
            .toGRB()
            .forEach((v, i) =>
                this.pixels[this.componentIndex(point, i)] = v
            )

    clear = () => this.pixels = this.createPixels()

    getCanvas = () => this.pixels

    private createPixels = () => new Uint8ClampedArray(Math.pow(this.side, 2) * 3)

    private componentIndex = (point: Point, offset: number) =>
        point.toIndex(this.side) * 3 + offset
}
