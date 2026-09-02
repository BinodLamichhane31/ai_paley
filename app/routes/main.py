from flask import Blueprint, render_template, Response
from datetime import datetime
from app.models.database import db
from app.utils.video import video_processor
from app.decorators.auth import login_required

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
@login_required
def home():
    vehicles_count = db.vehicles.count_documents({})
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_access = db.access_logs.count_documents({

    })
    recent_logs = list(db.access_logs.find()
                      .sort('timestamp', -1)
                      .limit(10))
    
    return render_template('body.html',
                         vehicles_count=vehicles_count,
                         today_access=today_access,
                         recent_logs=recent_logs)

@main_bp.route('/video_feed')
@login_required
def video_feed():
    return Response(video_processor.generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@main_bp.route('/access_logs')
@login_required
def access_logs():
    logs = list(db.access_logs.aggregate([
        {'$lookup': {
            'from': 'vehicles',
            'localField': 'vehicle_id',
            'foreignField': '_id',
            'as': 'vehicle_details'
        }},
        {'$unwind': '$vehicle_details'},
        {'$sort': {'timestamp': -1}},
        {'$limit': 100}
    ]))
    return render_template('access_logs.html', logs=logs)