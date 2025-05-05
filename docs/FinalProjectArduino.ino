// Memory Game

const int buttonPins[4] = {10, 11, 12, 13};  // Left to right: Green, Yellow, Blue, Red
const int ledPins[4]    = {2, 3, 4, 5};      // Matching Green to Red order
const int buzzerPin     = 6;                 // Passive buzzer
int tones[4] = {262, 330, 392, 523};         // C4, E4, G4, C5

void setup() {
  for (int i = 0; i < 4; i++) {
    pinMode(buttonPins[i], INPUT);
    pinMode(ledPins[i], OUTPUT);
  }
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  for (int i = 0; i < 4; i++) {
    if (digitalRead(buttonPins[i]) == HIGH) {
      digitalWrite(ledPins[i], HIGH);
      tone(buzzerPin, tones[i], 200);
      Serial.println(i);  
      delay(300);         // delay for button
      digitalWrite(ledPins[i], LOW);
    }
  }
}
