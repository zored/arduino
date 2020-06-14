export const delay = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration))

export const intervals = async (ms: number[], f: (msIndex: number) => any, loops = Infinity) => new Promise<void>((resolve) => {
    if (ms.length === 0) {
        throw new Error(`There are zero intervals.`)
    }

    const step = async (msIndex: number, loop: number) => {
        if (ms.length >= msIndex) {
            msIndex = 0
            loop--
        }
        if (loop === 0) {
            resolve()
            return
        }
        const sleepMs = ms[msIndex]
        const result = f(msIndex)
        if (result instanceof Promise) {
            if (false === await result) {
                resolve();
                return;
            }
        }
        if (result === false) {
            resolve();
            return;
        }

        await delay(sleepMs)

        // noinspection ES6MissingAwait
        step(msIndex + 1, loop)
    }

    step(0, loops)
})

export type IntervalsParams = [number[], () => any, number]
export const intervalsDetached = (a: IntervalsParams[]) =>
    a.forEach(([ms, f, tries]) => intervals(ms, f, tries))

export const retryOnThrow = async <T>(f: () => T, retries = 3, intervalMs = 1000): Promise<T> => {
    let lastError = new Error('no error')
    for (let i = 0; i < retries; i++) {
        try {
            const result = f()
            if (result instanceof Promise) {
                return await result
            }
            return result
        } catch (e) {
            console.log(`caught error, retry ${i} of ${retries}`, e)
            lastError = e
            await delay(intervalMs)
        }
    }

    throw lastError
}

export const retryOnThrowSync = <T>(f: () => T, retries = 3): T => {
    let lastError = new Error('no error')
    for (let i = 0; i < retries; i++) {
        try {
            return f()
        } catch (e) {
            console.log(`caught error, retry ${i} of ${retries}`, e)
            lastError = e
        }
    }

    throw lastError
}