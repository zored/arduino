import {ILedsArtist} from "./ILedsArtist.ts"

export interface ILeds {
    draw(f: (artist: ILedsArtist) => void): void
}