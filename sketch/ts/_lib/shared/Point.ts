export class Point {
    constructor(public x: number, public y: number) {
    }

    toIndex = (width: number) => this.y * width + this.x
}