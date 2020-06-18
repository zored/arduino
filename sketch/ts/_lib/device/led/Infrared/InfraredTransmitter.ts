import {Times} from "../../sensor/InfraredTimeSensor.ts"

export class InfraredTransmitter {
    constructor(
        private plusSignal: AnalogPin,
        private minus: DigitalPin
    ) {
    }

    send = (t: Times): void => {
        analogWrite(this.minus,0.9,{freq:38000})
        digitalPulse(this.plusSignal, true, t);
        digitalPulse(this.plusSignal, true, 0);
        this.minus.reset()
        this.plusSignal.reset()
    }
}