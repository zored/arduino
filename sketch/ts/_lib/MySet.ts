
export class MySet<T> {
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