import {retryOnThrowSync} from "../../std/intervals.ts"

const AmperkaBarometer = require('@amperka/barometer')

export class PressureSensor {
    private client?: IAmperkaBarometer

    constructor(private getI2C: (bitrate: number) => I2C) {
    }

    pressure = () => this.getClient().read('mmHg')
    temperature = () => this.getClient().temperature('C')

    getClient = () => this.client = this.client ?? this.createClient()

    do = (f: (client: IAmperkaBarometer) => number) => retryOnThrowSync(() => f(this.createClient()))

    createClient = () => {
        const client = AmperkaBarometer.connect({i2c: this.getI2C(400000)}) as IAmperkaBarometer
        client.init()

        // Skip wrong values:
        client.read("mmHg")
        client.temperature("C")

        return client
    }
}