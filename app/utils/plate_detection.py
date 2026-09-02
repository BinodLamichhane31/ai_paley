import cv2
import numpy as np
from ultralytics import YOLO
from datetime import datetime, timedelta
from config.settings import CHARACTER_CLASSES, DETECTION_COOLDOWN


plate_model = YOLO("models/platedetectionv8.pt")
character_model = YOLO("models/characterdetectionv11.pt")

recent_detections = {}

def calculate_dynamic_threshold(characters, num_lines=1):
    if len(characters) < 2:
        return 30
    horizontal_distances = [abs(characters[i]['x'] - characters[i-1]['x']) 
                          for i in range(1, len(characters))]
    avg_distance = np.mean(horizontal_distances)
    line_adjustment = np.clip(100 / (num_lines + 1), 15, 30)
    return np.clip(avg_distance / 2 + line_adjustment, 15, 50)

def sort_characters(characters):
    if not characters:
        return []
    characters.sort(key=lambda x: x['y'])
    lines = []
    current_line = [characters[0]]
    threshold = calculate_dynamic_threshold(characters)
    
    for char in characters[1:]:
        if abs(char['y'] - current_line[-1]['y']) < threshold:
            current_line.append(char)
        else:
            lines.append(sorted(current_line, key=lambda x: x['x']))
            current_line = [char]
    
    lines.append(sorted(current_line, key=lambda x: x['x']))
    return [char for line in lines for char in line]

def process_image(image_data):
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (640, 640))
    three_channel = cv2.cvtColor(resized, cv2.COLOR_GRAY2BGR)
    
    results = character_model(three_channel, conf=0.5)
    
    characters = []
    for box, cls in zip(results[0].boxes.xywh, results[0].boxes.cls):
        if int(cls) < len(CHARACTER_CLASSES):
            characters.append({
                'class': CHARACTER_CLASSES[int(cls)],
                'x': float(box[0]),
                'y': float(box[1])
            })
    
    sorted_chars = sort_characters(characters)
    return ''.join(char['class'] for char in sorted_chars)

def can_process_plate(plate_number):
    current_time = datetime.now()
    if plate_number in recent_detections:
        last_detection = recent_detections[plate_number]
        if current_time - last_detection < timedelta(seconds=DETECTION_COOLDOWN):
            return False
    return True

def cleanup_old_detections():
    current_time = datetime.now()
    expired_plates = [
        plate for plate, timestamp in recent_detections.items()
        if current_time - timestamp > timedelta(seconds=DETECTION_COOLDOWN)
    ]
    for plate in expired_plates:
        del recent_detections[plate]