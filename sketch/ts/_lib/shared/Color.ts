import {HexColor} from "./data/animation/IAnimation.ts"

type V255 = number;
type V1 = number;
type A3V255 = [V255, V255, V255]
type A3V1 = [V1, V1, V1]
type Component = 'red' | 'green' | 'blue'

export class Color {
    private constructor(private red: V255, private green: V255, private blue: V255) {
        this.each(Color.assert255)
    }

    static fromHex(color: HexColor): Color {
        const parts: [string, string, string] = ['00', '00', '00']
        switch (color.length) {
            case 4:
                for (let i = 0; i < 3; i++) {
                    parts[i] = color[i + 1].repeat(2)
                }
                break
            case 7:
                for (let i = 0; i < 3; i++) {
                    const start = i * 2 + 1
                    parts[i] = color.substring(start, start + 2)
                }
                break
            default:
                throw new Error(`Invalid color ${color}.`)
        }
        const [red, green, blue] = parts.map(p => parseInt(p, 16))

        return new Color(red, green, blue)
    }

    static fromRGB255 = (v: A3V255) => new Color(v[0], v[1], v[2])

    private static assert255(n: V255): void {
        if (n < 0 || n > 255) {
            throw new Error(`Invalid color part: ${n}`)
        }
    }

    toGRB = () => this.to('green', 'red', 'blue')

    multiply = (m: number) => this.map(c => c * m)

    toArray = (): A3V255 => [this.red, this.green, this.blue]

    toGRB1 = (): A3V1 => this.toN(1).to('green', 'red', 'blue')

    toN = (m: number) => this.map(v => v * m / 255)

    to = (a: Component, b: Component, c: Component): A3V255 => [this[a], this[b], this[c]]

    private map = (f: (v: V255) => V255) => Color.fromRGB255(this.toArray().map(f) as A3V255)

    private each = (f: (v: V255) => void) => this.toArray().forEach(f)
}
