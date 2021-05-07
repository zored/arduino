import {promisify, promisifyAll} from "../std/Promise.ts"

const AmperkaBluetooth = require('@amperka/bluetooth')

export class BluetoothDevice {
    private readonly speed = 9600
    private client?: IBluetooth

    constructor(private serial: Serial = Serial3, private controlPin: Pin = P5) {
    }

    listen = async (f: (v: string) => void) => {
        this.controlPin.reset()
        this.serial.on('data', d => print(d))
        // const b = this.getClient()
        // b.on('error', (e) => console.log(e))
        // await promisifyAll([
            // k => b.firmware(k),
            // k => b.mode('slave', k),
            // k => b.name('robbo', k),
            // k => b.password('8581', k),
        // ])
        // b.on('data', f)
    }

    private getClient = (): IBluetooth => {
        if (this.client) {
            return this.client
        }
        Serial3.setup(this.speed, {})
        this.controlPin.reset()
        return this.client = AmperkaBluetooth.connect({
            serial: this.serial,
            speed: this.speed,
            kPin: this.controlPin,
            lineEnding: '\r\n'
        })
    }
}