# arduino
Here are my scripts for:
- [Arduino UNO](https://store.arduino.cc/usa/arduino-uno-rev3).
- [Espruino](https://github.com/espruino/Espruino)-based [Isrka JS](http://wiki.amperka.ru/js:iskra_js).

## Flash
[Arduino](./sketch/ino).
```
./run.ts flash ./sketch/ino/AnalogLight
```

[Espruino](./sketch/ts):
```
./run.ts flash --build=wifi
```

## Host
You can run JS on host PC to control Arduino UNO via [Firmata firmware](https://github.com/firmata/arduino):
```
./run.ts flash ./sketch/ino/Firmata
./run.ts host
```
