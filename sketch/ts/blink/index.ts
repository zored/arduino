import { PinContainer } from "../_lib/PinContainer.ts";


class Led {
    private active?: boolean;
    public readonly pin: Pin
    constructor(pin: Pin){
        this.pin = arguments[0];
    }
    on(){
        return this.toggle(true)
    }
    off() {
        return this.toggle(false)
    }
    toggle(active?: boolean): boolean {
        console.log(`PIN B6: ${this.pin}`);
        active = active ?? !this.active
        this.write(active ? 255 : 0)
        return this.active = active
    }
    private write(v: number){
        analogWrite(this.pin, v, {})
    };
}

const pins = new PinContainer();
const pin = pins.output(B6);
console.log(`AFTER RETURN 1`, pin);
console.log(`AFTER RETURN 2`, pin);
const led = new Led(pin);
setInterval(() => console.log(`Led ${led.pin} activity: ${led.toggle()}`), 2000);
