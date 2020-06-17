export class InfraredTimeSensor {
    constructor(
        private input: DigitalPin,
    ) {
    }

    watch = () => {
        let durations: number[] = []
        const id = setWatch(function (e) {
            const duration = 1000 * (e.time - e.lastTime)
            if (duration < 1000) {
                durations.push(duration)
                return
            }
            durations = []
        }, this.input, {repeat: true})

        return () => {
            clearWatch(id)
            return durations
        }
    }
}