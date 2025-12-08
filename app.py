# app.py
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
import logging
import traceback

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# logging to console and file
logging.basicConfig(level=logging.INFO, format="%(asctime)s — %(levelname)s — %(message)s")
logger = logging.getLogger(__name__)


# Simple header-based type detection (no external deps)
MAGIC_SIGNATURES = {
    b'\xFF\xD8\xFF': "JPEG Image",
    b'\x89PNG': "PNG Image",
    b'%PDF': "PDF Document",
    b'PK\x03\x04': "ZIP Archive",
    b'MZ': "Windows Executable",
    b'\x7fELF': "ELF Executable"
}


def detect_type_from_header(data: bytes) -> str:
    if not data:
        return "Unknown"
    header = data[:8]
    for sig, name in MAGIC_SIGNATURES.items():
        if header.startswith(sig):
            return name
    return "Unknown"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/scan-file', methods=['POST'])
def scan_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in request"}), 400

        uploaded = request.files['file']
        if uploaded.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        save_path = os.path.join(app.config['UPLOAD_FOLDER'], uploaded.filename)
        uploaded.save(save_path)

        # read bytes for basic analysis
        with open(save_path, "rb") as f:
            data = f.read()

        size = len(data)
        detected_type = detect_type_from_header(data)

        # a simple "entropy-like" quick heuristic (byte variety)
        unique_bytes = len(set(data))
        byte_diversity = round((unique_bytes / max(1, size)) * 8, 3)  # scaled 0-8 like entropy-ish

        result = {
            "filename": uploaded.filename,
            "size_bytes": size,
            "detected_type": detected_type,
            "byte_diversity": byte_diversity,
            "message": "File scanned successfully",
            "status": "ok"
        }

        logger.info(f"Scanned file: {uploaded.filename} size={size} detected_type={detected_type}")
        return jsonify(result)
    except Exception as e:
        logger.error("Exception in /scan-file:\n" + traceback.format_exc())
        return jsonify({"error": "Internal server error during file scan", "details": str(e)}), 500


@app.route('/analyze-phishing', methods=['POST'])
def analyze_phishing():
    try:
        data = request.get_json(force=True, silent=True)
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data['text'].strip()
        if text == "":
            return jsonify({"error": "Empty text provided"}), 400

        # Very simple heuristics for demonstration
        suspicious_indicators = []
        lower = text.lower()
        if "click here" in lower or "verify your" in lower or "update your" in lower or "account suspended" in lower:
            suspicious_indicators.append("Urgent call-to-action / phishing style phrase")
        if "http://" in lower or "bit.ly" in lower or "tinyurl" in lower:
            suspicious_indicators.append("Shortened / suspicious link")
        if "bank" in lower and ("password" in lower or "account number" in lower or "pin" in lower):
            suspicious_indicators.append("Requests sensitive banking info")

        verdict = "Safe" if len(suspicious_indicators) == 0 else "Suspicious"
        response = {
            "verdict": verdict,
            "indicators": suspicious_indicators,
            "message": "Analysis complete"
        }
        logger.info(f"Phishing analyze: verdict={verdict} indicators={suspicious_indicators}")
        return jsonify(response)
    except Exception as e:
        logger.error("Exception in /analyze-phishing:\n" + traceback.format_exc())
        return jsonify({"error": "Internal server error during phishing analysis", "details": str(e)}), 500


@app.route('/check-password', methods=['POST'])
def check_password():
    try:
        data = request.get_json(force=True, silent=True)
        if not data or 'password' not in data:
            return jsonify({"error": "No password provided"}), 400
        pwd = str(data['password'])
        score = 0
        feedback = []
        if len(pwd) >= 12:
            score += 30
        else:
            feedback.append("Use at least 12 characters")

        if any(c.isupper() for c in pwd):
            score += 20
        else:
            feedback.append("Add uppercase letters")

        if any(c.islower() for c in pwd):
            score += 20
        else:
            feedback.append("Add lowercase letters")

        if any(c.isdigit() for c in pwd):
            score += 15
        else:
            feedback.append("Add numbers")

        if any(c in "!@#$%^&*()-_+=" for c in pwd):
            score += 15
        else:
            feedback.append("Add special characters")

        strength = "Weak" if score < 50 else "Moderate" if score < 80 else "Strong"
        return jsonify({"score": score, "strength": strength, "feedback": feedback})
    except Exception as e:
        logger.error("Exception in /check-password:\n" + traceback.format_exc())
        return jsonify({"error": "Internal server error during password check", "details": str(e)}), 500


@app.route('/start-simulation', methods=['GET'])
def start_simulation():
    try:
        # simple demo response
        logger.info("Simulation started")
        return jsonify({"message": "Simulation started — a fake phishing email was generated (educational only)."})
    except Exception as e:
        logger.error("Exception in /start-simulation:\n" + traceback.format_exc())
        return jsonify({"error": "Internal server error during simulation", "details": str(e)}), 500


@app.route('/view-attacks', methods=['GET'])
def view_attacks():
    try:
        demo = [
            {"time": "10:01", "type": "Port scan", "src": "192.168.1.5"},
            {"time": "10:02", "type": "Brute force", "src": "45.12.89.34"},
            {"time": "10:03", "type": "Suspicious download", "src": "103.45.22.9"}
        ]
        logger.info("Attacks viewed")
        return jsonify({"attacks": demo})
    except Exception as e:
        logger.error("Exception in /view-attacks:\n" + traceback.format_exc())
        return jsonify({"error": "Internal server error during view-attacks", "details": str(e)}), 500


if __name__ == '__main__':
    logger.info("Starting Flask app")
    app.run(debug=True)
