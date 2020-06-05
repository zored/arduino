import { MySet } from "./MySet.ts";

export class PinContainer {
    private busy = new MySet<Pin>();
    output(pin: Pin) {
        return this.get(pin, 'output')
    }
    input(pin: Pin){
        return this.get(pin, 'input')
    }
    private get(pin: Pin, mode: InputMode): Pin {
        console.log('GETTING', pin);
        if (this.busy.has(pin)) {
            throw new Error(`Pin ${pin} is already taken!`);
        }
        this.busy.add(pin);
        pinMode(pin, mode, false);
        return pin;
    }
}
