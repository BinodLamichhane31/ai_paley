#include <Servo.h>

const int SERVO_PIN = 9;    
const int OPEN_ANGLE = 90; 
const int CLOSED_ANGLE = 0; 
const int SERVO_DELAY = 1000;

Servo gateServo;

void setup() {
  Serial.begin(9600);
  gateServo.attach(SERVO_PIN);
  gateServo.write(CLOSED_ANGLE);
  delay(SERVO_DELAY);
  Serial.println("Gate controller initialized");
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();
    
    switch (command) {
      case 'O': 
        openGate();
        break;
        
      case 'C': 
        closeGate();
        break;
    }
  }
}

void openGate() {
  for (int angle = CLOSED_ANGLE; angle <= OPEN_ANGLE; angle += 2) {
    gateServo.write(angle);
    delay(15);
  }
  Serial.println("Gate opened");
}

void closeGate() {
  for (int angle = OPEN_ANGLE; angle >= CLOSED_ANGLE; angle -= 2) {
    gateServo.write(angle);
    delay(15);
  }
  Serial.println("Gate closed");
}
