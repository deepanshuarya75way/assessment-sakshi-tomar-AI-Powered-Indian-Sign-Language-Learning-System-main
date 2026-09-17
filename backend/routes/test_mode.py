 
from flask import Blueprint, jsonify, current_app
import os, random

test_bp = Blueprint('test_mode', __name__)

@test_bp.route('/phase1', methods=['GET'])
def phase1_question():
    # Sign Image dikhayega, User type karega
    letters = os.listdir(current_app.config['ASL_DIR'])
    target = random.choice(letters)
    img = random.choice(os.listdir(os.path.join(current_app.config['ASL_DIR'], target)))
    return jsonify({"image": f"/static/asl_images/{target}/{img}", "answer": target})

@test_bp.route('/phase2', methods=['GET'])
def phase2_question():
    # Text dikhayega, User Gesture perform karega
    letters = os.listdir(current_app.config['ASL_DIR'])
    return jsonify({"target": random.choice(letters)})