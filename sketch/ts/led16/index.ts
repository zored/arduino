import {IskraJs} from "../_lib/pin/IskraJs.ts"
import {LedsAnimation} from "../_lib/flow/pin/LedsAnimation.ts"
import * as config from "./config.json"

LedsAnimation
    .forPin(IskraJs.instance.getPin(P4))
    .start(config)