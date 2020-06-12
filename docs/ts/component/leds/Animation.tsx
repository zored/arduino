import {IAnimation} from "../../data/animation/IAnimation"
import {Frame} from "./Frame"
import * as React from "react"
import {useState} from "react"
import {Preview} from "./Preview"
import {IFrame} from "../../data/animation/IFrame"
import update from "immutability-helper"

export interface AnimationProps {
    animation: IAnimation
}

export const Animation = (p: AnimationProps) => {
    const [animation, setAnimation] = useState(p.animation)

    const setFrame = (i: number, frame: IFrame) =>
        setAnimation(update(animation, {frames: {[i]: {$set: frame}}}))

    const framesHtml = animation.frames.map((frame, i) =>
        <Frame
            key={`anim${i}`}
            color="#f00"
            frame={frame}
            onUpdate={f => setFrame(i, f)}
            index={i}/>
    )
    framesHtml.push(<Preview key="preview" animation={animation}/>)
    const html = framesHtml.reduce((acc, item, i) => {
        acc.push(item)
        if (i % 3 === 2) {
            acc.push(<br key={`br${i}`}/>)
        }
        return acc
    }, [] as any[])
    return <div>
        {html}
    </div>
}