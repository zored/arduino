export const delay = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration))


export const intervals = async (ms: number[], f: () => {}, tries = Infinity): Promise<void> => {
    if (ms.length === 0) {
        throw new Error(`There are zero intervals.`)
    }

    for (let i = 0; i < tries; i++) {
        for (const j in ms) {
            if (!ms.hasOwnProperty(j)) {
                continue
            }
            await delay(ms[j])
            f()
        }
    }
}