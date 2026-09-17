 
from flask import Blueprint, request, jsonify, current_app
import os

video_bp = Blueprint('video_mode', __name__)

@video_bp.route('/get-video', methods=['POST'])
def get_video():
    word = request.json.get('word', '').lower()
    video_file = f"{word}.mp4"
    path = os.path.join(current_app.config['VIDEO_DIR'], video_file)
    if os.path.exists(path):
        return jsonify({"found": True, "url": f"/static/isl_videos/{video_file}"})
    return jsonify({"found": False})