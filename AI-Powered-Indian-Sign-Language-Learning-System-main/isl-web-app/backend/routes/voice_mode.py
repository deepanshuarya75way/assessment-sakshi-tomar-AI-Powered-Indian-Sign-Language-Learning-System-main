from flask import Blueprint, request, jsonify
import speech_recognition as sr
from utils.dataset_loader import get_asl_image

voice_bp = Blueprint('voice_mode', __name__)

@voice_bp.route('/audio-translate', methods=['POST'])
def audio_to_sign():
    # Frontend se audio file aayegi
    r = sr.Recognizer()
    audio_file = request.files['audio']
    with sr.AudioFile(audio_file) as source:
        audio_data = r.record(source)
        try:
            text = r.recognize_google(audio_data).upper()
            result = []
            for char in text:
                if char.isalnum():
                    img_url = get_asl_image(char)
                    result.append({"char": char, "url": img_url})
            return jsonify({"status": "success", "text": text, "data": result})
        except:
            return jsonify({"status": "error", "message": "Voice not clear"}), 400