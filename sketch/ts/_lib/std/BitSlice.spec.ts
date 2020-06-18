import {BitSlice} from "./BitSlice"

test(`BitSlice.toBools`, () => {
    for (let i = 0; i < 100; i++) {
        let byteString = ''
        const bools: boolean[] = []
        for (let j = 0; j < 20; j++) {
            const active = Math.random() > 0.5
            bools.push(active)
            byteString += active ? '1' : '0'
        }
        const bits = BitSlice.fromString(byteString)
        expect(bits.toBools())
            .toEqual(bools)
    }
})
test(`BitSlice.toNumbers`, () => {
    const s = '0111100000111000001101000000101111'
    const numbers = BitSlice.fromString(s).toNumbers()
    expect(numbers).toEqual([3492551710, 3])
    expect(BitSlice.fromNumbers(numbers, s.length).toString()).toEqual(s)
})