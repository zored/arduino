import {HexColor} from "./data/animation/IAnimation.ts"

export class Color {
    private constructor(private red: number, private green: number, private blue: number) {
        this.toRGB().forEach(Color.assert255)
    }

    static fromHex(color: HexColor): Color {
        const parts: [string, string, string] = ['00', '00', '00']
        switch (color.length) {
            case 4:
                for (let i=0; i<3; i++) {
                    parts[i] = color[i+1].repeat(2);
                }
                break;
            case 7:
                for (let i=0; i<3; i++) {
                    const start = i*2+1
                    parts[i] = color.substring(start, start + 2);
                }
                break;
            default:
                throw new Error(`Invalid color ${color}.`)
        }
        const [red, green, blue] = parts.map(p => parseInt(p, 16));

        return new Color(red, green, blue);
    }

    private static assert255(n: number): void {
        if (n < 0 || n > 255) {
            throw new Error(`Invalid color part: ${n}`)
        }
    }

    toGRB255 = () => [
        this.green,
        this.red,
        this.blue,
    ]

    private toRGB = () => [this.red, this.green, this.blue]
}
