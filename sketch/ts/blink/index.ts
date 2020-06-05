class MySet<T> {
    private readonly vs: T[];

    constructor(...values: T[]) {
        this.vs = values
    }

    add(v: T){
        if (!this.has(v)) {
            this.vs.push(v)
        }
        return this
    }

    has(v: T){
        return this.vs.indexOf(v) >= 0
    }
}

class PinContainer {
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
        console.log('BEFORE RETURN', pin);
        return pin;
    }
}

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
