export function addGlobals(values: Record<string, any>): void {
    for (let name in values) {
        const value = values[name]
        if (global[name] !== undefined) {
            throw new Error(`Global '${name}' already exists.`)
        }
        global[name] = value
    }
}