import serial
import time
from playsound import playsound
import threading
from config.settings import ARDUINO_PORT, BAUD_RATE

class ArduinoController:
    def __init__(self):
        try:
            self.arduino = serial.Serial(ARDUINO_PORT, BAUD_RATE, timeout=1)
            time.sleep(2)
        except:
            print("Warning: Arduino not connected")
            self.arduino = None

    def play_sound(self):
        try:
            print("Playing access sound")
            playsound('app/static/sounds/audio.mp3')
        except Exception as e:
            print(f"Error playing sound: {e}")

    def control_gate(self, command):
        if self.arduino:
            try:
                print(f"Attempting to {command} gate")
                if command == 'open':
                    print("Sending open command")
                    self.arduino.write(b'O')
                    time.sleep(5)
                    print("Sending close command")
                    self.arduino.write(b'C')
                elif command == 'close':
                    print("Sending close command")
                    self.arduino.write(b'C')
            except Exception as e:
                print(f"Error controlling gate: {e}")

    def process_access(self):
        self.control_gate('open')
        self.play_sound()

arduino_controller = ArduinoController()