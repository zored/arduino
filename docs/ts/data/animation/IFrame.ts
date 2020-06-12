import {HexColor} from "./IAnimation"

export interface IFrame {
    durationMs: number
    colors: HexColor[][]
}