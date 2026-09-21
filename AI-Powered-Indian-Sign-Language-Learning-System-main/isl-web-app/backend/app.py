import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
import json
import base64
import cv2
import numpy as np
from tensorflow.keras.models import load_model
import glob
try:
    from routes.image_mode import image_bp
except ImportError:
    image_bp = None

app = Flask(__name__, static_folder='static')

# 1. Configuration & Robust Security
app.config['SECRET_KEY'] = 'sign_bridge_secret_key_2026'
CORS(app, resources={r"/*": {"origins": "*"}})

# Optimized SocketIO for High-Speed Image Streaming
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode='threading',
    logger=False,
    engineio_logger=False,
    max_decode_packets=10  # Performance boost
)

# 2. Paths
basedir = os.path.abspath(os.path.dirname(__file__))
STATIC_PATH = os.path.join(basedir, 'static')
db_path = os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['ASL_DIR'] = os.path.join(STATIC_PATH, 'asl_images')
app.config['VIDEO_DIR'] = os.path.join(STATIC_PATH, 'isl_videos')

db = SQLAlchemy(app)

# Register Blueprints for API Endpoints
try:
    from routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api')
except Exception as e:
    print(f"Warning auth_bp: {e}")

try:
    from routes.image_mode import image_bp
    app.register_blueprint(image_bp, url_prefix='/api')
except Exception as e:
    print(f"Warning image_bp: {e}")

try:
    from routes.profile import profile_bp
    app.register_blueprint(profile_bp, url_prefix='/api')
except Exception as e:
    print(f"Warning profile_bp: {e}")

try:
    from routes.test_mode import test_bp
    app.register_blueprint(test_bp, url_prefix='/api')
except Exception as e:
    print(f"Warning test_bp: {e}")

try:
    from routes.video_mode import video_bp
    from routes.sign_search import sign_search_bp
    app.register_blueprint(sign_search_bp,url_prefix='/api')
    app.register_blueprint(video_bp, url_prefix='/api')
except Exception as e:
    print(f"Warning video_bp: {e}")

# ==========================================
# 🧠 AI ENGINE: MODEL & LABELS LOADING
# ==========================================
MODEL_PATH = os.path.join(basedir, 'sign_model_cnn.h5')
LABELS_PATH = os.path.join(basedir, 'labels.json')

model = None
LABELS = {}

# Dynamic Labels Sync
if os.path.exists(LABELS_PATH):
    try:
        with open(LABELS_PATH, 'r') as f:
            label_map = json.load(f)
            # Ensure index is integer for rapid lookup
            LABELS = {int(v): k for k, v in label_map.items()}
        print(f"✅ Neural Engine: {len(LABELS)} Labels Linked.")
    except Exception as e:
        print(f"❌ Error syncing labels: {e}")

# High Performance Model Load
if os.path.exists(MODEL_PATH):
    try:
        model = load_model(MODEL_PATH)
        print("✅ Trained CNN Model Booted Successfully!")
    except Exception as e:
        print(f"❌ Core Model Failure: {e}")


# 3. User Database Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))


with app.app_context():
    db.create_all()

# --- 4. SMART STATIC SERVING ---
@app.route('/static/asl_images/<char>/<dummy>')
def serve_asl_images(char, dummy):
    char = char.upper()
    folder_path = os.path.join(STATIC_PATH, 'asl_images', char)
    found = glob.glob(os.path.join(folder_path, "*.jpeg")) + glob.glob(os.path.join(folder_path, "*.jpg"))
    if found:
        return send_from_directory(folder_path, os.path.basename(found[0]))
    return "Not Found", 404

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory(STATIC_PATH, path)

# --- 4. UPLOAD VALIDATION ROUTE ---
@app.route('/api/upload_predict', methods=['POST'])
def upload_predict():
    if model is None:
        return jsonify({"error": "Engine Offline"}), 500

    try:
        file = request.files['image']
        nparr = np.frombuffer(file.read(), np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Corrupt Image"}), 400

        # Pre-processing Pipeline (Aligned with Training)
        img = cv2.resize(frame, (64, 64))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = img.astype('float32') / 255.0  # Proper Normalization
        img = np.expand_dims(img, axis=0)

        # Inference
        preds = model.predict(img, verbose=0)
        class_idx = np.argmax(preds)
        confidence = float(np.max(preds))
        label = LABELS.get(class_idx, "Unknown")

        print(f"📂 [Static Test] Result: {label} ({confidence * 100:.1f}%)")

        return jsonify({
            "prediction": label,
            "confidence": round(confidence * 100, 2),
            "status": "Success"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- 5. REAL-TIME STREAMING INFERENCE ---
@socketio.on('process_frame')
def handle_frame(data):
    if model is None or not LABELS: return

    try:
        header, encoded = data['image'].split(",", 1)
        img_data = base64.b64decode(encoded)
        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None: return

        # ---  Aggressive Preprocessing for Low-Res Frames ---

        # 1. Contrast badhao taaki hath dark background se alag dikhe
        frame = cv2.convertScaleAbs(frame, alpha=1.5, beta=20)

        # 2. Image ko sharp karo (Edges highlight honge)
        kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
        frame = cv2.filter2D(frame, -1, kernel)

        # 3. Model target size
        img = cv2.resize(frame, (64, 64))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # 4. Normalization
        img = img.astype('float32') / 255.0
        img = np.expand_dims(img, axis=0)

        # Prediction
        preds = model.predict(img, verbose=0)
        class_idx = np.argmax(preds)
        confidence = float(np.max(preds))
        label = LABELS.get(class_idx, "Unknown")

        #  Display Logic
        if confidence > 0.65:  # Threshold thoda kam kiya hai low-res ke liye
            emit('prediction_result', {'label': label, 'confidence': confidence})
            print(f"📡 Predicted: {label} ({confidence * 100:.1f}%)")

    except Exception as e:
        print(f"🔥 Error: {e}")
  # Ye asli photo save karega jo AI dekh raha hai
# --- 6. AUTH & SYSTEM ROUTES ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email'), password=data.get('password')).first()
    if user:
        return jsonify({"token": "auth_2026", "user": user.fullname}), 200
    return jsonify({"message": "Invalid credentials"}), 401



if __name__ == '__main__':
    # Local Server Link
    socketio.run(app, debug=True, port=5000, host='127.0.0.1', allow_unsafe_werkzeug=True)

try:
    from routes.sign_search import sign_search_bp
    app.register_blueprint(sign_search_bp, url_prefix='/api')
except Exception as e:
    print(f"Warning sign_search_bp:{e}")