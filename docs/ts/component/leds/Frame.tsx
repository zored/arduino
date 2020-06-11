import * as React from "react"
import {IFrame} from "../../data/animation/IFrame"
import {Point} from "../../../../sketch/ts/_lib/shared/Point"
import {HexColor} from "../../data/animation/IAnimation"
import * as $ from "jquery"

export interface FrameProps {
    index: number
    frame: IFrame
    color: HexColor
}

export const Frame = (props: FrameProps) => {
    const color = props.color
    const [frame, setFrame] = React.useState(props.frame)
    const [drawing, setDrawing] = React.useState(false)

    const st = <T extends object>(o: T): T => ({...o})
    const fill = (p: Point) => {
        frame.colors[p.y][p.x] = color
        return frame
    }
    const fillOnDraw = (p: Point): IFrame => drawing ? fill(p) : frame
    const prevent = (f: () => void) => (e: React.BaseSyntheticEvent) => {
        e.preventDefault()
        f()
    }

    return <div className="frame"  onMouseUp={() => console.log('ooo')}>
        <div className="title">
            Frame #{props.index}
        </div>
        <pre>{JSON.stringify({frame, color, drawing}, null, 2)}</pre>
        <table>
            <tbody>
            {frame.colors.map((colorsRow, y) =>
                <tr key={'y' + y}>{
                    colorsRow.map((backgroundColor, x) => {
                        const point = new Point(x, y)
                        return <td
                            key={'x' + x}
                            style={{backgroundColor, width: 40, height: 40, display: 'block'}}
                            // onMouseDown={prevent(() => setDrawing(true))}
                            onMouseUp={() => {
                                console.log('mouseup')
                                setDrawing(false)
                            }}
                            // onMouseMove={prevent(() => setFrame(st(fillOnDraw(point))))}
                            // onClick={() => fill(point)}
                        />
                    })
                }</tr>
            )}
            </tbody>
        </table>
    </div>
}