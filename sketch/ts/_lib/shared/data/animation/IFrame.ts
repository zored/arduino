import {HexColor} from "./IAnimation.ts"

export interface IFrame {
    durationMs: number
    colors: HexColor[][]
}