const {Led, Board} = require("johnny-five");

const main = () => new AnalogPinBoard().run();

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

class AnalogPinBoard extends LedBoard {
  constructor(analogLedPin = 9) {
    super(analogLedPin)
  }

  ready() {
    super.ready();
    
    const blink = () => this.led.fadeIn(1000, () => setTimeout(() => this.led.fadeOut(1000, blink), 1000));
    blink();
  }
}

main();