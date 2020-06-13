type InputMode = 'analog'| 'input'| 'input_pullup'| 'input_pulldown'| 'output'| 'opendrain'| 'af_output' | 'af_opendrain';

declare interface DigitalPin extends Pin {}
declare interface AnalogPin extends DigitalPin {}
declare interface SpiMosiPin extends Pin {}

declare var P1: AnalogPin;
declare var P3: AnalogPin | SpiMosiPin;
declare var P4: DigitalPin | SpiMosiPin;
declare var P6: AnalogPin;
declare var P7: DigitalPin;
declare var A7: AnalogPin | SpiMosiPin;
declare var B6: Pin;
declare var LED1: Pin;
declare var global: Record<string, any>
declare var PrimarySerial: Serial
declare var Serial3: Serial

type RGB1 = [number, number, number]
type F1 = number
declare interface ILedStrip {
    putColor(index: number, color: RGB1): void
    clear(): void
    apply(): void

    brightness(brightness: F1): void
}
declare interface AmperkaLedStripFactory {
    connect(spi: SPI, length: number, type: string): ILedStrip
}

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
