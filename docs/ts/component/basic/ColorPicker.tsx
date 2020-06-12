import {HexColor} from "../../../../sketch/ts/_lib/shared/data/animation/IAnimation"
import * as React from "react"
import {useState} from "react"
import {range} from "lodash"
import * as Color from "color"

export interface Props {
    onChange: (c: HexColor) => void
}

export const ColorPicker = (p: Props) => {
    const [color, setColor_] = useState('#ff0000')
    const setColor = (c: HexColor) => {
        setColor_(c)
        p.onChange(c)
    }
    const createButton = (backgroundColor: HexColor) =>
        <input
            type="button"
            className="color-button"
            key={`button${backgroundColor}`}
            style={{backgroundColor}}
            onClick={() => setColor(backgroundColor)}
        />
    const buttons = range(0, 360, 30).map((hue) =>
        createButton(Color(`hsl(${hue}, 100%, 50%)`).hex())
    ).concat([
        createButton('#000000'),
        createButton('#ffffff'),
    ])

    return <div className="color-picker">
        <input
            className="color-button custom"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
        />
        {buttons}
    </div>
}
