# arduino
Here are my [arduino](https://www.arduino.cc/) scripts. I have UNO board.

## Sketches
You can flash any [sketch](./sketch).
```
./run.ts flash AnalogLight
```

## JS Host
You can run JS on host PC to control Arduino. To do this you need [Firmata](https://github.com/firmata/arduino) firmware on Arduino:
```
./run.ts flash Firmata
./run.ts run
```