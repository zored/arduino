import {HttpRetriever} from "../std/HttpRetriever.ts"
import {IskraJs} from "../pin/IskraJs.ts"
import {retryOnThrow} from "../std/intervals.ts"

const AmperkaWifi = require('@amperka/wifi')

type Client = AmperkaWifiClient
type AccessPoint = WifiAccessPoint

export class WiFi {
    private client?: AmperkaWifiClient

    private constructor(
        private login: string,
        private password: string,
        private serial: Serial
    ) {
    }

    static fromEnv = (serial: Serial = IskraJs.instance.getUART()) => new WiFi(WIFI_LOGIN, WIFI_PASSWORD, serial)

    connect = async () => {
        if (this.client !== undefined) {
            return this.client
        }

        this.serial.setup(115200, {})
        const client = await this.createClient()

        await retryOnThrow(() => this.authorize(client))
        HttpRetriever.setHasTransport()
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
            err => err ? bad(err) : ok()
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
