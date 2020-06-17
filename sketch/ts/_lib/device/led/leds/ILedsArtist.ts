import {Point} from "../../../shared/Point.ts"
import {Color} from "../../../shared/Color.ts"

export interface ILedsArtist {
    setColor(point: Point, color: Color): void

    clear(): void
}