import {Frame} from "./Frame"
import * as React from "react"
import {useState} from "react"
import {Preview} from "./Preview"
import {IFrame} from "../../data/animation/IFrame"
import update from "immutability-helper"
import {ColorPicker} from "../basic/ColorPicker"
import {range} from "lodash/fp"
import {IAnimation} from "../../data/animation/IAnimation"

export interface AnimationProps {
    width: number
    height: number
    frames: number
}

export const Animation = (p: AnimationProps) => {
    const [color, setColor] = useState('#ff0000')
    const [frames, setFrames_] = useState(p.frames)
    const createFrames = (frames: number) => range(0, frames)
        .map(() => ({
            colors: range(0, p.width)
                .map(() => range(0, p.height).map(() => '#000')),
            durationMs: 200
        }))
    const [animation, setAnimation_] = useState({
        frames: createFrames(frames)
    })
    const setAnimation = (a : IAnimation) => {
        setAnimation_({frames: []})
        setAnimation_(a)
    }
    const setFrameCount = (v: number) => {
        setFrames_(v)
        setAnimation(update(animation, {frames: {$set: createFrames(v)}}))
    }
    const setFrame = (i: number, frame: IFrame) =>
        setAnimation(update(animation, {frames: {[i]: {$set: frame}}}))

    return <div>
        <input
            type="number"
            value={frames}
            onChange={e => setFrameCount(parseInt(e.target.value))}
        />
        <ColorPicker onChange={c => setColor(c)}/>

        {animation.frames.map((frame, i) =>
            <Frame
                key={`anim${i}_${frame.colors.join('')}`}
                color={color}
                frame={frame}
                onUpdate={f => setFrame(i, f)}
                index={i}/>
        )}

        <br/>
        <Preview key="preview" animation={animation}/>

        <div className="code">
        <textarea
            value={JSON.stringify(animation, null, 2)}
            onClick={e => (e.target as HTMLTextAreaElement).select()}
            onChange={e => setAnimation(JSON.parse(e.target.value) as IAnimation)}
        />
        </div>
    </div>
}