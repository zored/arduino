const {
  Led,
  Board,
  Sensor,
  Piezo,
  Button,
  Pin,
} = require("johnny-five");
const execa = require("execa");

const main = () => {
  const macBook = new MacBook();
  const digitFlow = new DigitFlow();

  new MyBoard().run(new AllFlow([
    new SensorFlow(sensor => {
      macBook.setVolume(sensor.scaleTo(0, 60))
    }),
    new SensorFlow(
      sensor => digitFlow.counter?.setValue(sensor.scaleTo(0, 9)), 
      pins.lightSensor,
    ),
    new ButtonFlow(() => macBook.toggleMusic()),
    digitFlow,
    new BlinkFlow(),
    new AnalogLedFlow(pins.led9),
  ]))
}

const pins = {
  button: 4,
  led: 3,
  led9: 9,
  sensor: 'A0',
  lightSensor: 'A1',
  piezo: 0,
  register: {
    data: 13,
    clock: 12,
    latch: 11,
  },
  counter4026: {
    clock: 5,
    reset: 6,
  }
};

class DigitFlow {
  ready() {
    this.counter = new Counter4026();
  }
  exit() {
    this.counter.setValue(8)
  }
}
class RateLimit {
  constructor(ms = 1000) {
    this.ms = ms
  }

  call(f) {
    const now = new Date()
    if (this.date && now.getTime() - this.date.getTime() < this.ms) {
      return;
    }
    f();
    this.date = now;
  }
}

class MacBook {
  setVolume(v) {
    if (this.volume === v) {
      return;
    }
    this.volume = v;
    console.log(`volume set to ${v}`)
    execa.sync('/usr/local/bin/m', ['volume', v])
  }
  toggleMusic() {
    execa.sync(`osascript`, ['-l', 'JavaScript', '-e', `
      const music = Application("Music");
      switch (music.playerState()) {
        case 'paused':
          music.play();
          break;
        default:
          music.pause();
          break;
      }
  `])
  }
}

class AllFlow {
  constructor(flows) {
    this.flows = flows
  }

  ready() {
    this.flows.forEach(f => f.ready && f.ready());
  }

  exit() {
    this.flows.forEach(f => f.exit && f.exit());
  }
}

class ButtonFlow {
  constructor(callback) {
    this.callback = callback;
  }
  ready() {
    new Button(pins.button).on("up", () => this.callback())
  }
}

class PeizoFlow {
  constructor(piezoPin = pins.piezo) {
    this.piezoPin = piezoPin;
  }

  ready() {
    this.piezo = new Piezo(this.piezoPin);
    this.playMusic();
  }

  playMusic() {
    if (this.piezo.isPlaying) {
      return;
    }
    this.piezo.play({
      song: "CEFG--CEFG--CEFG-E-C-E-D-".split('').join(' '),
      beats: 1 / 2,
      tempo: 100
    });
  }
}

class LedFlow {
  constructor(ledPin = pins.led) {
    this.ledPin = ledPin;
  }

  ready() {
    this.led = new Led(this.ledPin);
  }

  exit() {
    this.led.off();
  }
}

class BlinkFlow extends LedFlow {
  ready() {
    super.ready()
    this.led.blink(1000);
  }
}

class AnalogLedFlow extends LedFlow {
  constructor(analogLedPin = pins.led) {
    super(analogLedPin)
  }

  ready() {
    super.ready();
    this.startLed()
  }

  startLed() {
    const f = () => this.led.fadeIn(1000, () => setTimeout(() => this.led.fadeOut(1000, f), 1000));
    f();
  }

  exit() {
    super.exit();
  }
}

class SensorFlow {
  constructor(callback = (sensor) => {}, pin = pins.sensor) {
    this.pin = pin
    this.logger = new IntervalLogger();
    this.callback = callback
  }

  ready() {
    this.sensor = new Sensor(this.pin)
    this.sensor.on('change', () => this.callback(this.sensor));
  }
}

class IntervalLogger {
  constructor() {
    this.last = new Date()
    this.values = [];
  }
  log(value) {
    const now = new Date()
    this.values.push(value);
    if (now.getTime() - this.last.getTime() < 1000) {
      return;
    }

    const sum = this.values.reduce((sum, value) => sum + value, 0);
    const average = sum / this.values.length;
    console.log(average);
    this.values = [];
    this.last = now;
  }
}

class MyBoard {
  constructor() {
    this.board = new Board({
      repl: false
    })
  }

  run(flow) {
    this.board.on("ready", () => {
      flow.ready();
      this.board.on("exit", () => flow.exit());
    });
  }
}


Pin.prototype.highLow = function () {
  this.high()
  this.low()
}

class Counter4026 {
  constructor(
    clockPinValue = pins.counter4026.clock,
    resetPinValue = pins.counter4026.reset,
  ) {
    this.clockPinValue = clockPinValue;
    this.resetPinValue = resetPinValue;
    this.n = 0;
    this.started = false;
  }

  _start() {
    if (this.started) {
      return;
    }
    this.clockPin = new Pin(this.clockPinValue);
    this.resetPin = new Pin(this.resetPinValue);
    this.pins = [this.clockPin, this.resetPin];
    this._reset();
    this.started = true;
  }

  _reset() {
    this.resetPin.highLow()
    this.n = 0;
  }

  setValue(n = 0) {
    this._start()
    if (n > 9) {
      n = 9
    } else if (n < 0) {
      n = 0
    }

    if (n === this.n) {
      return
    }

    if (n < this.n) {
      this._reset()
    }

    for (let i = this.n; i < n; i++) {
      this._increment();
    }
  }

  _increment() {
    this.clockPin.highLow()
    this.n++
  }
}

main();