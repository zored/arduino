const {Led, Board, Sensor, Piezo, Button} = require("johnny-five");

const pins = {
  button: 7,
}
const main = () => {
  const piezoFlow = new PeizoFlow();
  new MyBoard().run(new AllFlow([
    piezoFlow,
    new AnalogLedFlow(),
    new ButtonFlow(() => piezoFlow.playMusic()),
  ]))
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
  constructor(piezoPin = 3) {
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
  constructor(ledPin = 13) {
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
  constructor(analogLedPin = 9) {
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

class SensorLedFlow extends AnalogLedFlow {
  constructor() {
    super();
    this.logger = new IntervalLogger();
  }

  ready() {
    this.sensor = new Sensor("A1")
    super.ready()
  }

  startLed () {
    this.sensor.on('data', () => this.onSensorData());
  }

  onSensorData() {
    const brightness = this.sensor.scaleTo(0, 255);
    this.logger.log(brightness);
    this.led.brightness(brightness);
  }

  exit() {
    super.exit();
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
    this.board = new Board({repl: false})
  }

  run(flow) {
    this.board.on("ready", () => {
      flow.ready();
      this.board.on("exit", () => flow.exit());
    });
  }
}
main();