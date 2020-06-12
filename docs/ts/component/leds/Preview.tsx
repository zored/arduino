import * as React from "react"
import {useState} from "react"
import {IAnimation} from "../../data/animation/IAnimation"

export interface PreviewProps {
    animation: IAnimation
}

export const Preview = (props: PreviewProps) => {
    const [frameIndex, setFrameIndex] = useState(0)
    const frame = props.animation.frames[frameIndex]

    setTimeout(() =>
            setFrameIndex(frameIndex === props.animation.frames.length - 1
                ? 0
                : frameIndex + 1),
        frame.durationMs
    )
    return <div className="frame">
        <h2>Preview</h2>
        <div>Frame #{frameIndex}</div>
        <table className="pin-table">
            <tbody>
            {frame.colors.map((colorsRow, y) =>
                <tr key={'previewY' + y}>{
                    colorsRow.map((backgroundColor, x) =>
                        <td
                            key={'previewX' + x}
                            style={{backgroundColor, width: 40, height: 40}}
                        />)
                }</tr>
            )}
            </tbody>
        </table>
    </div>
}