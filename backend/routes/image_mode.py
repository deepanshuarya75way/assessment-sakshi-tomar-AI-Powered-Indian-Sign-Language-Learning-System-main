from flask import Blueprint, request, jsonify, current_app, url_for
import os
import random

image_bp = Blueprint('image_mode', __name__)


@image_bp.route('/text-to-sign', methods=['POST'])
def text_to_sign():
    # Input text ko clean aur uppercase karein
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data.get('text', '').upper().strip()
    result = []

    # ASL_DIR ka path configuration se lein (App initialization mein set hona chahiye)
    # Default fallback to static/asl_images if not set
    asl_base_dir = current_app.config.get('ASL_DIR', os.path.join(current_app.root_path, 'static', 'asl_images'))

    for char in text:
        # Filter: Sirf A-Z aur 0-9 characters allowed hain
        if not char.isalnum():
            continue

        char_dir = os.path.join(asl_base_dir, char)

        if os.path.exists(char_dir):
            try:
                # Sirf images files uthayein (filtering hidden files like .DS_Store)
                imgs = [f for f in os.listdir(char_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

                if imgs:
                    chosen_img = random.choice(imgs)
                    # Flask static path generate karein
                    img_url = f"http://127.0.0.1:5000/static/asl_images/{char}/{chosen_img}"

                    result.append({
                        "char": char,
                        "url": img_url,
                        "status": "success"
                    })
                else:
                    result.append({"char": char, "status": "empty", "message": "No images in folder"})
            except Exception as e:
                result.append({"char": char, "status": "error", "message": str(e)})
        else:
            # Agar folder hi nahi mila
            result.append({
                "char": char,
                "status": "missing",
                "url": f"https://placehold.jp/24/1e293b/38bdf8/200x200.png?text={char}"
            })

    return jsonify(result)


# Dataset overview route (Optional: for debugging)
@image_bp.route('/dataset-stats', methods=['GET'])
def get_stats():
    asl_base_dir = current_app.config.get('ASL_DIR', os.path.join(current_app.root_path, 'static', 'asl_images'))
    if not os.path.exists(asl_base_dir):
        return jsonify({"error": "Dataset directory not found"}), 404

    folders = os.listdir(asl_base_dir)
    return jsonify({
        "total_categories": len(folders),
        "categories": folders
    })