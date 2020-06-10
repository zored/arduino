export const wrapLogs = async <T>(promise: Promise<T>, before: string, after: string): Promise<T> => {
    console.log(`${before}...`)
    const result = await promise
    console.log(`${after}!`)
    return result
}