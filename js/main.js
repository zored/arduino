const {Led, Board} = require("johnny-five");

function main() {
  const board = new BlinkBoard();
  board.run();
}

class RootBoard {
  ready() {}
  exit() {}
  run() {
    const board = new Board({repl: false});
    board.on("ready", () => {
      this.ready()
      board.on("exit", () => this.exit());
    });
  }
}

class BlinkBoard extends RootBoard {
  ready() {
    this.led = new Led(13);
    this.led.blink(1000);
  }

  exit() {
    this.led.off();
  }
}

main();