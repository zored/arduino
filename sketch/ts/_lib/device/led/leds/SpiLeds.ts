import {ILeds} from "./ILeds.ts"
import {ILedsArtist} from "./ILedsArtist.ts"
import {SpiLedsArtist} from "./SpiLedsArtist.ts"


export class SpiLeds implements ILeds {
    private constructor(private artist: SpiLedsArtist) {
    }

    static forSPI = (spi: SPI) => new SpiLeds(
        new SpiLedsArtist(spi)
    )

    draw = (f: (artist: ILedsArtist) => void): void => {
        f(this.artist)
        this.artist.apply()
    }
}
