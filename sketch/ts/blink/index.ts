class Led {
    private active = false;
    constructor(public pin: Pin){}
    on = () => this.toggle(true)
    off = () => this.toggle(false)
    toggle = (active?: boolean): boolean => {
        active = active ?? !this.active
        this.write(active ? HIGH : LOW)
        return this.active = active
    }
    private write = (v: number) => digitalWrite(this.pin, v)
}

const led = new Led(B6)
setInterval(() => console.log(`Led ${led.pin} activity: ${led.toggle()}`), 2000);
