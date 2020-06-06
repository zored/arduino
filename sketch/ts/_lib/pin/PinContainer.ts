import { MySet } from "../std/MySet.js";

export class PinContainer {
    private busy = new MySet<Pin>();
    output = (pin: Pin) => this.get(pin, 'output')
    input = (pin: Pin) => this.get(pin, 'input')
    private get(pin: Pin, mode: InputMode): Pin {
        if (this.busy.has(pin)) {
            throw new Error(`Pin ${pin} is already taken!`);
        }
        this.busy.add(pin);
        pinMode(pin, mode, false);
        return pin;
    }
}
