from flask import Blueprint, request, jsonify, render_template, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from app.models.database import users_collection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if not all([username, password, confirm_password]):
            return jsonify({
                'success': False, 
                'error': 'All fields are required'
            }), 400
        
        if password != confirm_password:
            return jsonify({
                'success': False, 
                'error': 'Passwords do not match'
            }), 400
        
        existing_user = users_collection.find_one({'username': username})
        if existing_user:
            return jsonify({
                'success': False, 
                'error': 'Username already exists'
            }), 409
        
        user_data = {
            'username': username,
            'password': generate_password_hash(password),
            'created_at': datetime.utcnow(),
            'last_login': None
        }
        
        users_collection.insert_one(user_data)
        
        return jsonify({
            'success': True,
            'message': 'Account created successfully'
        }), 201
    
    return render_template('signup.html')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if not all([username, password]):
            return jsonify({
                'success': False, 
                'error': 'Username and password are required'
            }), 400
        
        user = users_collection.find_one({'username': username})
        if not user or not check_password_hash(user['password'], password):
            return jsonify({
                'success': False, 
                'error': 'Invalid username or password'
            }), 401
        
        users_collection.update_one(
            {'username': username},
            {'$set': {'last_login': datetime.utcnow()}}
        )
        
        session['username'] = username
        session['logged_in'] = True
        
        return jsonify({
            'success': True,
            'redirect': url_for('main.home')
        }), 200
    
    return render_template('login.html')

@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth.login'))