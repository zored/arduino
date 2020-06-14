// https://github.com/amperka/espruino-modcat/blob/master/modules/%40amperka/gas-sensor.js
const AmperkaGasSensor = require('@amperka/gas-sensor')

export class CO2Sensor {
    private resistanceDivider = 29.8
    private client?: IGasSensor

    constructor(private data: Pin, private heat: Pin) {
    }

    heatOnceAndRead = () => new Promise<number>((resolve) => {
        const client = this.getClient()
        client.preheat(() => {
            this.resistanceDivider = this.createClient().calibrate(this.resistanceDivider)
            const co2 = client.read("CO2")
            client.heat(false)
            resolve(co2)
        })
    })

    private getClient = (): IGasSensor => this.client = this.client ?? this.createClient()

    private createClient = () => {
        const client: IGasSensor | Error = AmperkaGasSensor.connect({
            dataPin: this.data,
            heatPin: this.heat,
            model: 'MQ135'
        })

        // WTF?
        if (client instanceof Error) {
            throw client
        }
        client.heat(false)
        return client
    }
}