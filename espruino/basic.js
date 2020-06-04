const AmperkaButton = require('@amperka/button')
const AmperkaLed = require('@amperka/led')
var button = AmperkaButton.connect(C4);
var led = AmperkaLed.connect(B6);
button.on('press', () => led.turnOn());
button.on('release', () => led.turnOn());