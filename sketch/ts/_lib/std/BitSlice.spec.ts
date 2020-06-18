import {BitSlice} from "./BitSlice"

test(`bit slice`, () => {
    for (let i = 0; i < 100; i++) {
        let byteString = ''
        const bools: boolean[] = []
        for (let j = 0; j < 20; j++) {
            const active = Math.random() > 0.5
            bools.push(active)
            byteString += active ? '1' : '0'
        }
        const bits = BitSlice.fromString(byteString)
        expect([...bits.toBools()])
            .toEqual(bools)
    }
})