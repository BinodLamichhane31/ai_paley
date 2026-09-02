import cv2
from datetime import datetime
from app.models.database import db
from app.utils.plate_detection import plate_model, process_image, can_process_plate, cleanup_old_detections, recent_detections
from app.utils.arduino import arduino_controller
import threading

class VideoProcessor:
    def __init__(self):
        self.camera = cv2.VideoCapture(2)
    def process_access(self, plate_number, access_type, access_details):
        if access_type == 'registered':
            db.access_logs.insert_one({
                'plate_number': plate_number,
                'timestamp': datetime.utcnow(),
                'vehicle_id': access_details['vehicle_id'],
                'dispatch_timestamp': datetime.utcnow(),
                'dispatch_status': 'completed'
            })
        elif access_type == 'visitor':
            db.visitor_access_logs.insert_one({
                'plate_number': plate_number,
                'visitor_name': access_details['visitor_name'],
                'vehicle_purpose': access_details['vehicle_purpose'],
                'timestamp': datetime.utcnow()
            })
            
            db.visitor_tokens_collection.update_one(
                {'visitor_name': access_details['visitor_name']},
                {'$set': {'used': True}}
            )
        
        threading.Thread(target=arduino_controller.process_access).start()

    def generate_frames(self):
        while True:
            success, frame = self.camera.read()
            if not success:
                break
            
            cleanup_old_detections()
            results = plate_model(frame)
            
            if len(results[0].boxes) > 0:
                for box in results[0].boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    plate_img = frame[y1:y2, x1:x2]
                    
                    _, buffer = cv2.imencode('.jpg', plate_img)
                    plate_number = process_image(buffer.tobytes())
                    
                    if can_process_plate(plate_number):
                        access_granted = False
                        access_type = None
                        access_details = None
                        
                        vehicle = db.vehicles.find_one({
                            'plate_number': plate_number,
                            'status': 'active'
                        })
                        
                        if vehicle:
                            access_granted = True
                            access_type = 'registered'
                            access_details = {
                                'vehicle_id': vehicle['_id'],
                                'plate_number': plate_number,
                                'owner_name': vehicle.get('owner_name', 'Unknown')
                            }
                        
                        if not access_granted:
                            visitor_token = db.visitor_tokens_collection.find_one({
                                'expires_at': {'$gt': datetime.utcnow()},
                                'used': False
                            })
                            
                            if visitor_token:
                                access_granted = True
                                access_type = 'visitor'
                                access_details = {
                                    'visitor_name': visitor_token['visitor_name'],
                                    'vehicle_purpose': visitor_token['vehicle_purpose']
                                }
                        
                        if access_granted:
                            recent_detections[plate_number] = datetime.now()
                            self.process_access(plate_number, access_type, access_details)
                    
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, plate_number, (x1, y1-10),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
            
            cv2.putText(frame, datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

video_processor = VideoProcessor()