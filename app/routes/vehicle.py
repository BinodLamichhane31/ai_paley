from flask import Blueprint, request, jsonify, render_template, Response
from datetime import datetime
import base64
from bson import ObjectId
from app.models.database import db, fs
from app.utils.plate_detection import process_image
from app.decorators.auth import login_required

vehicle_bp = Blueprint('vehicle', __name__)

@vehicle_bp.route('/register', methods=['GET', 'POST'])
@login_required
def register_vehicle():
    if request.method == 'POST':
        try:
            if 'plate_image' not in request.files:
                return jsonify({'success': False, 'error': 'License plate image is required'}), 400
            
            if not request.form.get('owner_name'):
                return jsonify({'success': False, 'error': 'Owner name is required'}), 400
                
            if not request.form.get('vehicle_type'):
                return jsonify({'success': False, 'error': 'Vehicle type is required'}), 400
            
            file = request.files['plate_image']
            if file.filename == '':
                return jsonify({'success': False, 'error': 'No selected file'}), 400
            
            allowed_extensions = {'png', 'jpg', 'jpeg'}
            if not '.' in file.filename or \
               file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
                return jsonify({'success': False, 'error': 'Invalid file type'}), 400
            
            image_data = file.read()
            plate_number = process_image(image_data)
            
            if not plate_number:
                return jsonify({'success': False, 'error': 'Could not detect license plate'}), 400
            
            existing_vehicle = db.vehicles.find_one({'plate_number': plate_number})
            if existing_vehicle:
                return jsonify({
                    'success': False, 
                    'error': f'Vehicle already registered'
                }), 409
            
            image_id = fs.put(image_data, 
                            filename=file.filename,
                            content_type=file.content_type)
            
            vehicle_data = {
                'plate_number': plate_number,
                'registration_date': datetime.utcnow(),
                'status': 'active',
                'owner_name': request.form['owner_name'].strip(),
                'vehicle_type': request.form['vehicle_type'],
                'notes': request.form.get('notes', '').strip(),
                'image_id': image_id,
                'last_updated': datetime.utcnow()
            }
            
            result = db.vehicles.insert_one(vehicle_data)
            
            db.registration_logs.insert_one({
                'vehicle_id': result.inserted_id,
                'plate_number': plate_number,
                'timestamp': datetime.utcnow(),
                'action': 'register'
            })
            
            return jsonify({
                'success': True,
                'plate_number': plate_number,
                'vehicle_id': str(result.inserted_id)
            }), 201
            
        except Exception as e:
            print(f"Registration error: {str(e)}")
            return jsonify({
                'success': False,
                'error': 'An error occurred during registration'
            }), 500
    
    return render_template('register.html')

@vehicle_bp.route('/vehicles')
@login_required
def list_vehicles():
    vehicles = list(db.vehicles.find())
    for vehicle in vehicles:
        if 'image_id' in vehicle:
            image_data = fs.get(vehicle['image_id']).read()
            vehicle['image'] = base64.b64encode(image_data).decode('utf-8')
    return render_template('manage-vehicle.html', vehicles=vehicles)

@vehicle_bp.route('/vehicle/<id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def manage_vehicle(id):
    if request.method == 'GET':
        vehicle = db.vehicles.find_one({'_id': ObjectId(id)})
        if vehicle:
            if 'image_id' in vehicle:
                image_data = fs.get(vehicle['image_id']).read()
                vehicle['image'] = base64.b64encode(image_data).decode('utf-8')
            return render_template('vehicle_details.html', vehicle=vehicle)
        return 'Vehicle not found', 404
    
    elif request.method == 'PUT':
        data = request.json
        db.vehicles.update_one(
            {'_id': ObjectId(id)},
            {'$set': {
                'status': data.get('status'),
                'notes': data.get('notes'),
                'last_updated': datetime.utcnow()
            }}
        )
        return jsonify({'success': True})
    
    elif request.method == 'DELETE':
        vehicle = db.vehicles.find_one({'_id': ObjectId(id)})
        if vehicle and 'image_id' in vehicle:
            fs.delete(vehicle['image_id'])
        db.vehicles.delete_one({'_id': ObjectId(id)})
        return jsonify({'success': True})