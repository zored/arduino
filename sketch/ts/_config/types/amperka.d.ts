type InputMode = 'analog'| 'input'| 'input_pullup'| 'input_pulldown'| 'output'| 'opendrain'| 'af_output' | 'af_opendrain';
declare var B6: Pin;
declare var LED1: Pin;
declare var global: Record<string, any>
interface ISerial {
    /**
     * @param rate example: 115200
     */
    setup(rate: number): void
}
declare var PrimarySerial: ISerial
declare var Serial3: ISerial
declare var OptErr: Error | null

/**
 * {@link http://wiki.amperka.ru/js:wifi}
 */
declare interface WifiAccessPoint {
    ssid: string
    enc: string
    signal: number
    mac: string
}
declare interface AmperkaWifiClient {
    connect(login: string, password: string, callback: (err: Error|undefined) => void): void
    getAPs(f: (err: Error|undefined, aps: WifiAccessPoint[]) => void): void
}
