#define LED 9
#define BUTTON 7

void setup () {
    pinMode(LED, OUTPUT);
    pinMode(BUTTON, INPUT);
}

void loop () {
    digitalWrite(LED, digitalRead(BUTTON));
}