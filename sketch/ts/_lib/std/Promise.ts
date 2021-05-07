type Callbackable = (resolve: () => void) => void
export const promisify = (f: Callbackable) => new Promise(resolve => f(resolve))
export const promisifyAll = async (fs: Callbackable[]) => {
    for (const i in fs) {
        if (!fs.hasOwnProperty(i)) {
            continue;
        }
        const f = fs[i];
        console.log(`promise ${i}`)
        await promisify(f)
    }
}