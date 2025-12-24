from flask import Flask, render_template, request, jsonify # Flask web framework, render_template loads HTML files from the templates/ folder, request handles incoming requests(files,JSON), jsonify creates JSON responses
from flask_cors import CORS # CORS handles cross-origin requests i,e,. allows frontend JS to call this backend even if hosted separately
import os # file handling and directories
import logging # logging events and errors
import traceback # detailed error traces for debugging
import re # regular expressions for pattern matching
from urllib.parse import urlparse # URL parsing, extracting domain names from URLs
from difflib import SequenceMatcher # string similarity checking for brand impersonation detection


app = Flask(__name__) # create Flask app instance(object)
CORS(app) # enable CORS so browser-based clients can access the API

UPLOAD_FOLDER = "uploads" # sets a folder called uploads to store uploaded files
os.makedirs(UPLOAD_FOLDER, exist_ok=True) # creates it if it doesn't exist
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER 

# logging to console and file
logging.basicConfig(level=logging.INFO, format="%(asctime)s — %(levelname)s — %(message)s") # configures logging to show time, severity level and message
logger = logging.getLogger(__name__) # logger is used throughout the app to log events


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
    header = data[:8] # reads first 8 bytes of file
    for sig, name in MAGIC_SIGNATURES.items(): #compares against known signatures
        if header.startswith(sig):
            return name # returns detected type
    return "Unknown"

def get_magic_number(data: bytes) -> str:
    if not data:
        return "N/A"
    return data[:8].hex().upper() # returns first 8 bytes as uppercase hex string

# -------------------------------
# Advanced Phishing Detection Engine
# -------------------------------

POPULAR_BRANDS = [
    "google.com", "microsoft.com", "amazon.com", "facebook.com",
    "instagram.com", "paypal.com", "apple.com", "netflix.com"
]

SUSPICIOUS_TLDS = [".tk", ".ml", ".cf", ".gq", ".zip"]

def extract_domain(url: str) -> str: # cleans and normalizes a URL, extract domain from URL
    try:
        url = url.strip().lower()

        # Fix broken https //example.com → https://example.com
        if url.startswith("https //"):
            url = url.replace("https //", "https://")

        if url.startswith("http //"):
            url = url.replace("http //", "http://")

        if not url.startswith("http"):
            url = "http://" + url

        domain = urlparse(url).netloc
        return domain.lower()
    except:
        return ""


def structural_risk(url): # adds risk points based on URL structure
    score = 0
    reasons = []

    if len(url) > 75:
        score += 10
        reasons.append("Very long URL")

    if "@" in url:
        score += 20
        reasons.append("Contains @ symbol")

    if "-" in url:
        score += 5
        reasons.append("Contains hyphens")

    if url.count(".") > 3:
        score += 10
        reasons.append("Too many subdomains")

    if re.search(r"\d{3,}", url):
        score += 10
        reasons.append("Contains long number sequences")

    return score, reasons


def brand_impersonation(domain): # Compares domain to popular brands using SequenceMatcher
    score = 0
    reasons = []

    for legit in POPULAR_BRANDS:
        similarity = SequenceMatcher(None, domain, legit).ratio()
        if similarity > 0.85 and domain != legit:
            score += 35
            reasons.append(f"Looks like fake version of {legit}")

    return score, reasons


def homoglyph_check(domain): # def homoglyph_check(domain):
    # Detects tricks like "rn" instead of "m", "vv" instead of "w", or numbers replacing letters
    score = 0
    reasons = []

    tricks = ["rn", "vv", "0", "1", "l"]
    for t in tricks:
        if t in domain:
            score += 10
            reasons.append(f"Possible visual trick: {t}")

    return score, reasons


def tld_risk(domain):
    # Adds risk if domain ends with suspicious TLDs
    score = 0
    reasons = []

    for tld in SUSPICIOUS_TLDS:
        if domain.endswith(tld):
            score += 15
            reasons.append(f"Suspicious TLD: {tld}")

    return score, reasons


def detect_phishing_url(url): # advanced phishing detection combining multiple heuristics, Runs all checks, sums scores, collects reasons

    domain = extract_domain(url)

    total_score = 0
    all_reasons = []

    s, r = structural_risk(url)
    total_score += s
    all_reasons += r

    s, r = brand_impersonation(domain)
    total_score += s
    all_reasons += r

    s, r = homoglyph_check(domain)
    total_score += s
    all_reasons += r

    s, r = tld_risk(domain)
    total_score += s
    all_reasons += r

    if total_score >= 60:
        verdict = "High Risk 🚩 Likely Phishing"
    elif total_score >= 30:
        verdict = "Suspicious ⚠️"
    else:
        verdict = "Likely Safe ✅"

    return verdict, total_score, all_reasons


@app.route('/') # serves the homepage
def index():
    return render_template('index.html')


@app.route('/info')
def info():
    return render_template('info.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/scan-file', methods=['POST']) # address /scan-file route, accepts POST requests with file uploads
def scan_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in request"}), 400

        uploaded = request.files['file']
        if uploaded.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        save_path = os.path.join(app.config['UPLOAD_FOLDER'], uploaded.filename) # saves it to uploads/ folder
        uploaded.save(save_path)

        with open(save_path, "rb") as f:
            data = f.read()

        size = len(data)
        detected_type = detect_type_from_header(data)

        # entropy-like analysis
        unique_bytes = len(set(data))
        byte_diversity = round((unique_bytes / max(1, size)) * 8, 3)
        entropy_percent = round((byte_diversity / 8) * 100, 2)

        # magic number
        magic_number = get_magic_number(data)

        result = {
            "filename": uploaded.filename,
            "size_bytes": size,
            "detected_type": detected_type,
            "byte_diversity": byte_diversity,
            "entropy_percentage": f"{entropy_percent}%",
            "magic_number": magic_number,
            "message": "File scanned successfully",
            "status": "ok"
        }

        logger.info(f"Scanned file: {uploaded.filename} | Type={detected_type}")

        return jsonify(result)

    except Exception as e:
        logger.error("Exception in /scan-file:\n" + traceback.format_exc())
        return jsonify({
            "error": "Internal server error during file scan",
            "details": str(e)
        }), 500



@app.route('/analyze-phishing', methods=['POST'])
def analyze_phishing():
    try:
        data = request.get_json(force=True, silent=True)
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400

        user_input = data['text'].strip()
        if user_input == "":
            return jsonify({"error": "Empty text provided"}), 400

        # Run advanced phishing engine
        verdict, score, reasons = detect_phishing_url(user_input)

        return jsonify({
            "verdict": verdict,
            "risk_score": score,
            "reasons": reasons
        })
    except Exception as e:
        logger.error("Exception in /analyze-phishing:\n" + traceback.format_exc())
        return jsonify({
            "error": "Internal server error during phishing analysis",
            "details": str(e)
        }), 500


@app.route('/check-password', methods=['POST'])
def check_password():
    try:
        data = request.get_json(force=True, silent=True) # get JSON data from request
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
    app.run(debug=True) # enables auto-reload and detailed error messages
