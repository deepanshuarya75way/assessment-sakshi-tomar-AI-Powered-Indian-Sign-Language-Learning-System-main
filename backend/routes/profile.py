from flask import Blueprint, jsonify, request

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/get-data', methods=['GET'])
def get_profile_data():
    # Report Section 6.2 ke stats
    return jsonify({
        "username": "Sakshi Tomar",
        "email": "sakshitomar@example.com",
        "stats": {
            "total_tests": 25,
            "accuracy": "92.3%",
            "words_learned": 150
        },
        "history": [
            {"date": "2026-04-20", "score": 90, "type": "Phase 1"},
            {"date": "2026-04-21", "score": 85, "type": "Phase 2"},
            {"date": "2026-04-22", "score": 95, "type": "Video Mode"}
        ]
    })