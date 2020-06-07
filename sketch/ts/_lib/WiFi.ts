const AmperkaWifi = require('@amperka/wifi')

type Client = AmperkaWifiClient
type AccessPoint = WifiAccessPoint

export class WiFi {
    private client?: AmperkaWifiClient

    constructor(
        private login: string,
        private password: string,
        private serial: ISerial = PrimarySerial,
    ) {
    }

    connect = async () => {
        if (this.client !== undefined) {
            return this.client
        }

        this.serial.setup(115200)
        const client = await this.createClient()
        await this.authorize(client)
        return this.client = client
    }

    getAccessPoints = async (): Promise<AccessPoint[]> => {
        const client = await this.connect()
        return await this.getAps(client)
    }

    private authorize = (client: Client) => new Promise<void>((ok, bad) =>
        client.connect(
            this.login,
            this.password,
            err => {
                console.log('connected', err)
                err ? bad(err) : ok()
            }
        )
    )

    private getAps = (client: AmperkaWifiClient) => new Promise<AccessPoint[]>((ok, bad) =>
        client.getAPs((err, accessPoints) =>
            err ? bad(err) : ok(accessPoints)
        )
    )

    private createClient = () => new Promise<AmperkaWifiClient>((resolve, reject) => {
        const wifi: AmperkaWifiClient = AmperkaWifi.setup(
            this.serial,
            (err: Error | undefined) => err ? reject(err) : resolve(wifi)
        )
    })
}
