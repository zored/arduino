import {IskraJs} from "../_lib/pin/IskraJs.ts"

console.log(
    Object
        .entries(IskraJs.instance.allPins())
        .reduce(
            (a, [name, pin]) =>
                a[name] = (pin as any).getInfo(),
            {} as Record<string, any>
        )
)