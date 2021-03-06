export class Led {
    private active?: boolean;
    constructor(public readonly pin: Pin){}
    on = () => this.toggle(true)
    off = () => this.toggle(false)
    toggle(active?: boolean): boolean {
        active = active ?? !this.active
        this.write(active ? 255 : 0)
        return this.active = active
    }

    private write = (v: number) => analogWrite(this.pin, v, {})
}