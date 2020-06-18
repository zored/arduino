const IRReceiver = require("IRReceiver")

export type BitString = string
type Resolve = (value: BitString) => void;

export class InfraredCodeSensor {
    private listening = false

    private readonly codeQueue: BitString[] = []
    private readonly resolvesQueue: Resolve[] = []

    constructor(private pin: DigitalPin) {
    }

    getCode = () => {
        this.listenOnce()
        return new Promise(resolve => {
            const code = this.codeQueue.pop()
            if (code !== undefined) {
                resolve(code)
                return
            }
            if (this.resolvesQueue.length > 7) {
                console.log('too many IR resolves')
                return
            }
            this.resolvesQueue.push(resolve)
        })
    }

    private listenOnce = () => {
        if (this.listening) {
            return
        }
        IRReceiver.connect(this.pin, (c: BitString) => this.addCode(c))
        this.listening = true
    }

    private addCode(code: BitString): void {
        const resolve = this.resolvesQueue.pop()
        if (resolve) {
            resolve(code)
            return
        }

        if (this.codeQueue.length > 7) {
            console.log('too many IR codes')
            return
        }
        this.codeQueue.push(code)
    }
}