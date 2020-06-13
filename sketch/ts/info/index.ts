import {IskraJs} from "../_lib/pin/IskraJs.ts"

const board = IskraJs.instance
board.resetPublic();
console.log(
    Object
        .entries(board.allPins())
        .reduce(
            (a, [name, pin]) => {
                if (!pin) {
                    console.log(`Pin '${name}' is empty.`)
                    return a
                }
                a[name] = (pin as any).getInfo()
                return a
            },
            {} as Record<string, any>
        )
)