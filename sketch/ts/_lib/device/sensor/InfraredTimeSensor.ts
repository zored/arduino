export type Times = number[]

export class InfraredTimeSensor {
    constructor(
        private input: DigitalPin,
    ) {
    }

    watch = (): () => Times => {
        let durations: number[] = []
        this.input.mode('input_pullup')
        const id = setWatch(e => {
            const duration = 1000 * (e.time - e.lastTime)
            if (duration < 1000) {
                durations.push(duration)
                return
            }
            durations = []
        }, this.input, {repeat: true})

        return (): Times => {
            clearWatch(id)
            return durations
        }
    }
}