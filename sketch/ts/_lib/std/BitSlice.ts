import {BitString} from "../device/sensor/InfraredCodeSensor"

export class BitSlice {
    private static readonly blockBytes = Uint32Array.BYTES_PER_ELEMENT
    private static readonly blockSize = BitSlice.blockBytes * 8
    private readonly blocks: Uint32Array

    constructor(public readonly size: number) {
        let capacity = Math.ceil(Math.log2(size)) || 0
        while (capacity % BitSlice.blockBytes !== 0) {
            capacity++
        }
        const buffer = new ArrayBuffer(capacity)
        this.blocks = new Uint32Array(buffer)
    }

    static fromString = (s: BitString) => {
        const a = new BitSlice(s.length)
        s.split('').forEach((v: string, i: number) => a.set(i, v === '1'))
        return a
    }

    static fromNumbers(numbers: number[], size: number) {
        const s = new BitSlice(size)
        numbers.forEach((block, blockIndex) => {
            for (let i = 0; i < BitSlice.blockSize; i++) {
                const bitGlobalIndex = blockIndex * BitSlice.blockSize + i
                const active = 0 !== (block & (1 << i))
                s.set(bitGlobalIndex, active)
            }
        })
        return s
    }

    toBools() {
        const bools: boolean[] = [];
        for (let i = 0; i < this.size; i++) {
            bools.push(this.get(i))
        }
        return bools
    }

    toNumbers = (): number[] => [...this.blocks].map(v => v)

    toString = () => this.toBools().map(b => b ? '1' : '0').join('')

    private set(bitGlobalIndex: number, active: boolean): void {
        const {blockIndex, block, bit} = this.getBlock(bitGlobalIndex)

        this.blocks[blockIndex] = active
            ? (block | +bit)
            : (block & ~bit)
    }

    private getBlock(bitGlobalIndex: number) {
        const blockIndex = Math.floor(bitGlobalIndex / BitSlice.blockSize)
        const block: number = this.blocks[blockIndex] ?? 0
        const bitIndex = bitGlobalIndex - blockIndex * BitSlice.blockSize
        const bit = 1 << bitIndex
        return {blockIndex, block, bit}
    }

    private get(bitGlobalIndex: number): boolean {
        const {block, bit} = this.getBlock(bitGlobalIndex)
        return 0 !== (block & bit)
    }
}