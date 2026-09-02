import secrets

SECRET_KEY = secrets.token_hex(16)
DEBUG = False

MONGO_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "aipale"

ARDUINO_PORT = '/dev/ttyACM0'
BAUD_RATE = 9600

DETECTION_COOLDOWN = 40 

CHARACTER_CLASSES = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'BA', 'BAGMATI', 'CHA',
    'GA', 'GANDAKI', 'HA', 'JA', 'JHA', 'KA', 'KHA', 'KO', 'LU', 'LUMBINI',
    'MA', 'MADESH', 'ME', 'NA', 'PA', 'PRA', 'PRADESH', 'RA', 'SU', 'VE', 'YA'
]