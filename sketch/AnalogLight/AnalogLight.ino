#define LED 9
#define SENSOR A0

void setup () {
    pinMode(LED, OUTPUT);
    pinMode(SENSOR, INPUT);
}

void loop () {
    int rotation, brightness;
    rotation = analogRead(SENSOR);
    brightness = rotation / 4;
    analogWrite(LED, brightness);
}