import {BitString} from "../device/sensor/InfraredCodeSensor"

export class BitSlice {
    private static readonly blockSize = 8
    private readonly blocks: Uint8Array

    constructor(private readonly size: number) {
        const capacity = Math.ceil(Math.log2(size))
        const buffer = new ArrayBuffer(capacity)
        this.blocks = new Uint8Array(buffer)
    }

    static fromString = (s: BitString) => {
        const a = new BitSlice(s.length)
        s.split('').forEach((v: string, i: number) => a.set(i, v === '1'))
        return a
    }

    * toBools(): IterableIterator<boolean> {
        for (let i = 0; i < this.size; i++) {
            yield this.get(i)
        }
    }

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