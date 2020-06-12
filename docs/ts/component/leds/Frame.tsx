import * as React from "react"
import {IFrame} from "../../data/animation/IFrame"
import {Point} from "../../../../sketch/ts/_lib/shared/Point"
import {HexColor} from "../../data/animation/IAnimation"
import update from "immutability-helper"

export interface FrameProps {
    index: number
    frame: IFrame
    color: HexColor
    onUpdate: (f: IFrame) => void
}

export const Frame = (props: FrameProps) => {
    const {color} = props
    const [frame, setFrame_] = React.useState(props.frame)
    const [drawing, setDrawing] = React.useState(false)
    const setFrame = (f: IFrame) => {
        setFrame_(f)
        props.onUpdate(f)
    }

    const fill = (p: Point) =>
        setFrame(update(frame, {colors: {[p.y]: {[p.x]: {$set: color}}}}))
    const setDuration = (d: string) =>
        setFrame(update(frame, {durationMs: {$set: parseInt(d, 10)}}))
    const fillOnDraw = (p: Point): void => {
        if (drawing) {
            fill(p)
        }
    }
    const prevent = (f: () => void) => (e: React.BaseSyntheticEvent) => {
        e.preventDefault()
        f()
    }

    window.addEventListener('mouseup', () => setDrawing(false))

    return <div className="frame">
        <table className="pin-table">
            <tbody>
            {frame.colors.map((colorsRow, y) =>
                <tr key={'y' + y}>{
                    colorsRow.map((backgroundColor, x) => {
                        const point = new Point(x, y)
                        return <td
                            key={'x' + x}
                            style={{backgroundColor, width: 40, height: 40}}
                            onMouseDown={prevent(() => setDrawing(true))}
                            onMouseMove={prevent(() => fillOnDraw(point))}
                            onClick={() => fill(point)}
                        />
                    })
                }</tr>
            )}
            </tbody>
        </table>
        <input
            type="text"
            value={frame.durationMs}
            onChange={e => setDuration(e.target.value)}
        /> ms
    </div>
}