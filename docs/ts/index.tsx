import * as ReactDOM from "react-dom"
import {Animation} from "./component/leds/Animation"
import * as $ from "jquery"
import * as React from "react"

$(document).ready(() => {
    ReactDOM.render(
        <Animation width={4} height={4} frames={8}/>,
        $('#animation')[0]
    )
})