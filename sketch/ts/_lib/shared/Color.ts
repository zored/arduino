export class Color {
    private constructor(private red: number, private green: number, private blue: number) {
        this.toRGB().forEach(Color.assertZeroToOne)
    }

    static randomHue = () => Color.fromHSL(Math.random(), 1, 0.4)

    static fromHSL(hue: number, saturation: number, lightness: number) { // [0,1]
        Color.assertZeroToOne(hue)
        Color.assertZeroToOne(saturation)
        Color.assertZeroToOne(lightness)
        if (saturation === 0) {
            return new Color(lightness, lightness, lightness)
        }

        const hue2rgb = (pInner: number, qInner: number, t: number): number => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return pInner + (qInner - pInner) * 6 * t
            if (t < 1 / 2) return qInner
            if (t < 2 / 3) return pInner + (qInner - pInner) * (2 / 3 - t) * 6
            return pInner
        }

        const q = lightness < 0.5
            ? lightness * (1 + saturation)
            : lightness + saturation - lightness * saturation
        const p = 2 * lightness - q
        return new Color(
            hue2rgb(p, q, hue + 1 / 3),
            hue2rgb(p, q, hue),
            hue2rgb(p, q, hue - 1 / 3),
        )
    }

    toGBR255 = () => [this.green, this.blue, this.red].map(v => v * 255)

    private toRGB = () => [this.red, this.green, this.blue]

    private static assertZeroToOne(n: number): void {
        if (n < 0 || n > 1) {
            throw new Error(`Invalid color part: ${n}`)
        }
    }
}
