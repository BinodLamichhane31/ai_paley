from flask import Blueprint, request, jsonify, render_template
from datetime import datetime, timedelta
import secrets
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.database import db, visitor_tokens_collection
from app.decorators.auth import login_required
from app.utils.arduino import arduino_controller
import threading

visitor_bp = Blueprint('visitor', __name__)

@visitor_bp.route('/generate_visitor_token', methods=['GET', 'POST'])
@login_required
def generate_visitor_token():
    if request.method == 'GET':
        recent_tokens = list(visitor_tokens_collection.find().sort('created_at', -1).limit(50))
        for token in recent_tokens:
            token['_id'] = str(token['_id'])
        return render_template('generate_token.html', recent_tokens=recent_tokens)
    
    try:
        visitor_name = request.form.get('visitor_name')
        visitor_contact = request.form.get('visitor_contact')
        vehicle_purpose = request.form.get('vehicle_purpose')
        
        if not all([visitor_name, visitor_contact, vehicle_purpose]):
            return jsonify({
                'success': False, 
                'error': 'All fields are required'
            }), 400
        
        token = secrets.token_urlsafe(16)
        
        visitor_token_data = {
            'token': generate_password_hash(token),
            'visitor_name': visitor_name,
            'visitor_contact': visitor_contact,
            'vehicle_purpose': vehicle_purpose,
            'created_at': datetime.utcnow(),
            'expires_at': datetime.utcnow() + timedelta(hours=24),
            'access_count': 0,
            'max_access': 2,
            'status': 'active'
        }
        
        visitor_tokens_collection.insert_one(visitor_token_data)
        
        return jsonify({
            'success': True,
            'visitor_token': token,
            'expires_in': '24 hours'
        }), 201
        
    except Exception as e:
        print(f"Token generation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Token generation failed'
        }), 500

@visitor_bp.route('/validate_visitor_token', methods=['GET', 'POST'])
@login_required
def validate_visitor_token():
    if request.method == 'GET':
        return render_template('validate_token.html')
    
    try:
        token = request.form.get('visitor_token')
        
        if not token:
            return jsonify({
                'success': False, 
                'error': 'Token is required'
            }), 400
        
        visitor_token_doc = visitor_tokens_collection.find_one({
            'expires_at': {'$gt': datetime.utcnow()},
            'status': 'active',
            'access_count': {'$lt': 2}
        })
        
        if not visitor_token_doc or not check_password_hash(
            visitor_token_doc['token'], token
        ):
            return jsonify({
                'success': False, 
                'error': 'Invalid or expired token'
            }), 401
        
        new_access_count = visitor_token_doc['access_count'] + 1
        
        update_data = {
            '$inc': {'access_count': 1},
            '$set': {'last_access_timestamp': datetime.utcnow()}
        }
        
        if new_access_count >= 2:
            update_data['$set']['status'] = 'used'
        
        visitor_tokens_collection.update_one(
            {'_id': visitor_token_doc['_id']},
            update_data
        )
        
        threading.Thread(target=arduino_controller.process_access).start()
        
        db.visitor_access_logs.insert_one({
            'visitor_name': visitor_token_doc['visitor_name'],
            'vehicle_purpose': visitor_token_doc['vehicle_purpose'],
            'timestamp': datetime.utcnow(),
            'access_count': new_access_count
        })
        
        return jsonify({
            'success': True,
            'visitor_name': visitor_token_doc['visitor_name'],
            'vehicle_purpose': visitor_token_doc['vehicle_purpose'],
            'access_count': new_access_count,
            'message': 'Access Granted' if new_access_count < 2 else 'Final Access'
        }), 200
    
    except Exception as e:
        print(f"Token validation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Token validation failed'
        }), 500

@visitor_bp.route('/visitor_logs')
@login_required
def visitor_logs():
    logs = list(visitor_tokens_collection.find().sort('created_at', -1).limit(100))
    return render_template('visitor_logs.html', logs=logs)