import {delay, retryOnThrow, retryOnThrowSync} from "../../std/intervals.ts"

const AmperkaBarometer = require('@amperka/barometer')

export class PressureSensor {
    private client?: IAmperkaBarometer

    constructor(private getI2C: (bitrate: number) => I2C) {
    }

    pressure = async () => (await this.getClient()).read('mmHg')
    temperature = async () => (await this.getClient()).temperature('C')

    getClient = async () => this.client = this.client ?? await this.createClient()

    do = (f: (client: IAmperkaBarometer) => number) => retryOnThrow(async () => f(await this.getClient()))

    createClient = async () => {
        const client = AmperkaBarometer.connect({i2c: this.getI2C(400000)}) as IAmperkaBarometer
        retryOnThrowSync(() => client.init(), 5)
        await delay(1000)

        return client
    }
}