export function addGlobals(values: Record<string, any>): void {
    for (const name in values) {
        if (!values.hasOwnProperty(name)) {
            continue
        }
        const value = values[name]
        if (global[name] !== undefined) {
            throw new Error(`Global '${name}' already exists.`)
        }
        global[name] = value
        console.log(`Added global "${name}".`)
    }
}