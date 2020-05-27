const {Led, Board, Sensor} = require("johnny-five");

const main = () => new InputAnalogLedBoard().run();

class RootBoard {
  constructor() {
    this.board = new Board({repl: false});
  }
  ready() {}
  exit() {}

  run() {
    this.board.on("ready", () => {
      this.ready()
      this.board.on("exit", () => this.exit());
    });
  }
}

class LedBoard extends RootBoard {
  constructor(ledPin = 13) {
    super();
    this.ledPin = ledPin;
  }

  ready() {
    this.led = new Led(this.ledPin);
    super.ready();
  }

  exit() {
    this.led.off();
  }
}

class BlinkBoard extends LedBoard {
  ready() {
    super.ready()
    this.led.blink(1000);
  }
}

class AnalogLedBoard extends LedBoard {
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

class InputAnalogLedBoard extends AnalogLedBoard {
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
main();