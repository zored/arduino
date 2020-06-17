import {PinContainer} from "./PinContainer.ts"
import {Led} from "../device/led/Led.ts"

type Pins = Record<string, Pin>

export class IskraJs {
    static instance = new IskraJs()
    private led?: Led

    private constructor(private pins = new PinContainer()) {
    }

    getI2C() {
        return function (bitrate: number) {
            I2C1.setup({sda: SDA, scl: SCL, bitrate})
            return I2C1
        }
    }

    getLed = (): Led =>
        this.led = this.led ??
            new Led(this.pins.output(B6))

    getPin = <T extends Pin>(pin: T): T => this.pins.output(pin)

    allPins = () => ({
        ...this.getPinsP(),
        ...this.getPinsA(),
        ...this.getPinsEtc(),
    })

    resetPublic = () =>
        Object.values(this.getPinsP())
            .concat(Object.values(this.getPinsA()).slice(0, 5))
            .forEach(p => p.reset())

    getUART = (pin: string = "P1"): Serial => {
        switch (pin) {
            case "P1":
                return PrimarySerial
        }
        throw new Error(`No UART found for ${pin}.`)
    }

    getSPI = (pin: string = "P3"): SPI => {
        switch (pin) {
            case "P3":
                return SPI1
        }
        throw new Error(`No SPI found for ${pin}.`)
    }

    private getPinsP = () => {
        const pins: Pins = {}
        const add = this.getPinAdder(pins)
        for (let P = 0; P <= 13; P++) {
            add(`P${P}`)
        }
        return pins
    }

    private getPinsA = () => {
        const pins: Pins = {}
        const add = this.getPinAdder(pins)
        for (let A = 0; A <= 15; A++) {
            add(`A${A}`)
        }
        return pins
    }

    private getPinsEtc = () => {
        const pins: Pins = {}
        const add = this.getPinAdder(pins);
        ['SCL', 'SDA', 'LED1', 'LED2'].forEach(add)
        return pins
    }

    private getPinAdder(pins: Pins) {
        return function (name: string) {
            return pins[name] = global[name]
        }
    }
}

