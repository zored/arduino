export class WiFi {
    constructor(
        private login: string,
        private password: string,
        private serial: ISerial = PrimarySerial,
    ) {
    }

    connect = () => {
        this.serial.setup(115200)
        return new Promise(async (resolve, reject) => {
            console.log('xxx')
            const wifi = await this.setup()
            console.log('yyy', wifi)
            wifi.connect(this.login, this.password, err => {
                if (err) {
                    reject(err)
                    return
                }
                resolve()
            })
        })
    }

    private setup = () => new Promise<AmperkaWifiSetup>((resolve, reject) => {
        const wifi: AmperkaWifiSetup = require('@amperka/wifi')
            .setup(this.serial, (err: Error | undefined) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(wifi)
            })
    })
}
