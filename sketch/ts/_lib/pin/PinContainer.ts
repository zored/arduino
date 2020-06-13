import { MySet } from "../std/MySet.js";

export class PinContainer {
    private busy = new MySet<Pin>();
    output = <T extends Pin>(pin: T):T => this.get(pin, 'output')
    input = <T extends Pin>(pin: T):T => this.get(pin, 'input')
    private get<T extends Pin>(pin: T, mode: InputMode): T {
        if (this.busy.has(pin)) {
            throw new Error(`Pin ${pin} is already taken!`);
        }
        this.busy.add(pin);
        pinMode(pin, mode, false);
        return pin;
    }
}
