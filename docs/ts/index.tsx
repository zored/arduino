import {Color} from "../../sketch/ts/_lib/shared/Color"
import * as ReactDOM from "react-dom"
import {Animation} from "./component/leds/Animation"
import * as $ from "jquery"
import * as React from "react"
import {IAnimation} from "./data/animation/IAnimation"

$(document).ready(() => {
    Color.fromHSL(1, 1, 0.5)
    console.log('ok')
    const range = (length: number) => Array.from({length})
    const animation: IAnimation = {
        frames: range(4).map(() => ({
            colors: range(4).map(() => range(4).map(() => '#00f')),
            durationMs: 200
        }))
    }

    ReactDOM.render(
        <Animation animation={animation}/>,
        $('#colors')[0]
    )
    old()
})


function old() {
    let drawing = false
    const key = (v: boolean) => (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            drawing = v
        }
    }

    const frames: any[] = []
    const refreshResult = () => $('#result').val(JSON.stringify(frames))
    refreshResult()

    const rgbToHex = (s: any) => {
        const {red, green, blue} = s
            .match(/rgb\((?<red>\d+),\s*(?<green>\d+),\s*(?<blue>\d+)\)/)
            .groups

        const componentToHex = (c: any) => {
            const hex = parseInt(c).toString(16)
            return hex.length == 1 ? '0' + hex : hex
        }

        return '#' + componentToHex(red) + componentToHex(green) + componentToHex(blue)
    }

    const $body = $('body');
    for (let hue = 0; hue <= 360; hue += 36) {
        $('<input type="button"/>')
            .css({backgroundColor: `hsl(${hue}, 100%, 50%)`})
            .on('click', e => $('#color').val(rgbToHex(getComputedStyle(e.target).backgroundColor)))
            .appendTo($body)
    }
    const $table = $('<table>').appendTo($body)
    const time = 20
    const $time = $(`<input type="number" value="${time}">`).appendTo($body)
    console.log('kek')
    let index = 0
    const colors: any[] = []
    const frameIndex = frames.push({
        colors,
        time,
    }) - 1
    const initialColor = '#000000'

    const updateColor = (index: any, color: any) => {
        frames[frameIndex].colors[index] = color
        refreshResult()
    }
    for (let x = 0; x < 4; x++) {
        const $row = $('<tr>').appendTo($table)
        for (let y = 0; y < 4; y++) {
            const colorIndex = index++
            colors[colorIndex] = initialColor

            const draw = (e: any) => {
                const color: any = $('#color').val()
                $(e.target).css({'background-color': color})
                colors[colorIndex] = color
                updateColor(colorIndex, color)
            }
            $(`<td>${colorIndex}</td>`)
                .appendTo($row)
                .css({
                    width: 20,
                    height: 20,
                })
                .on({
                    mousemove: e => {
                        if (drawing) {
                            draw(e)
                        }
                    },
                    mousedown: draw,
                })
                .css({
                    'background-color': initialColor,
                })
        }
    }
}