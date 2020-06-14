const DHT11 = require("DHT11")

export type Temperature = number
export type Humidity = number
export type ReadResult = {
    temperature: number,
    humidity: number
}

export class HumiditySensor {
    private dht?: IDHT11

    constructor(private pin = P7) {
    }

    read = () => new Promise<ReadResult>((resolve) =>
        this.getClient().read(({temp, rh}) => resolve({
            temperature: temp,
            humidity: rh,
        }))
    )

    private getClient = (): IDHT11 =>
        this.dht = this.dht ??
            DHT11.connect(this.pin)
}