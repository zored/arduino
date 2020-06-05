export class Led {
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
        active = active ?? !this.active
        this.write(active ? 255 : 0)
        return this.active = active
    }
    private write(v: number){
        analogWrite(this.pin, v, {})
    };
}