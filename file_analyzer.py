# file_analyzer.py
import os
import io
import hashlib
from PIL import Image, UnidentifiedImageError
from PyPDF2 import PdfReader
import magic  # python-magic-bin on Windows
from utils.entropy import calculate_entropy
from ai_engine import ai_threat_analysis

# Known magic numbers (hex) for quick checks (uppercase)
MAGIC_NUMBERS = {
    "jpg": "FFD8FF",
    "png": "89504E47",
    "gif": "47494638",
    "pdf": "25504446",
    "zip": "504B0304",
    "exe": "4D5A",
    "elf": "7F454C46"  # linux executable
}

def read_file_bytes(file_storage):
    """
    Read bytes from Flask's FileStorage, reset stream pointer.
    """
    file_storage.stream.seek(0)
    data = file_storage.read()
    file_storage.stream.seek(0)
    return data

def get_basic_info(file_storage, file_bytes):
    """
    Return size, filename, extension, sha256
    """
    filename = file_storage.filename
    file_size = len(file_bytes)
    ext = os.path.splitext(filename)[1].lower().lstrip(".")
    sha256 = hashlib.sha256(file_bytes).hexdigest()
    return {"filename": filename, "file_size": file_size, "ext": ext, "sha256": sha256}

def detect_mime(file_bytes):
    """
    Use libmagic to detect mime type from bytes.
    """
    try:
        mime = magic.from_buffer(file_bytes, mime=True)
    except Exception:
        # fallback
        mime = "application/octet-stream"
    return mime

def detect_magic_number(file_bytes, header_len=8):
    """
    Get header hex and try to match MAGIC_NUMBERS.
    """
    header = file_bytes[:header_len].hex().upper()
    detected = None
    for key, sig in MAGIC_NUMBERS.items():
        if header.startswith(sig):
            detected = key
            break
    return header, detected

def extract_image_info(file_bytes):
    """
    Try to get simple image metadata using Pillow.
    Returns dict or None if not image.
    """
    try:
        with Image.open(io.BytesIO(file_bytes)) as im:
            info = {
                "format": im.format,
                "mode": im.mode,
                "size": im.size,  # (width, height)
            }
            # EXIF available?
            exif = {}
            try:
                raw_exif = im.getexif()
                if raw_exif:
                    for tag, value in raw_exif.items():
                        exif[tag] = str(value)
            except Exception:
                exif = {}
            if exif:
                info["exif_count"] = len(exif)
                info["exif_sample"] = dict(list(exif.items())[:5])
            return info
    except UnidentifiedImageError:
        return None
    except Exception:
        return None

def extract_pdf_info(file_bytes):
    """
    Try to read PDF metadata using PyPDF2.
    """
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        md = reader.metadata
        info = {}
        if md:
            # convert to normal dict and str
            for k, v in md.items():
                info[str(k)] = str(v)
        info["pages"] = len(reader.pages)
        return info
    except Exception:
        return None

def analyze_file(file_storage):
    """
    Main function called from Flask route. Returns a dictionary
    with analysis results (JSON serializable).
    """
    file_bytes = read_file_bytes(file_storage)
    basic = get_basic_info(file_storage, file_bytes)

    # 1) Mime detection
    mime = detect_mime(file_bytes)

    # 2) Magic number detection
    header_hex, detected_type = detect_magic_number(file_bytes)

    # 3) Entropy
    entropy = calculate_entropy(file_bytes)

    # 4) Try to extract format-specific metadata
    image_info = extract_image_info(file_bytes)
    pdf_info = extract_pdf_info(file_bytes)

    # 5) Heuristic risk scoring (explainable)
    risk = 0
    reasons = []

    # entropy rule
    if entropy >= 7.5:
        risk += 50
        reasons.append("High entropy (possible encrypted/compressed or packed payload)")

    # magic number mismatch rule
    if detected_type is None:
        risk += 30
        reasons.append("Unknown or missing magic number (file header not recognized)")

    # extension vs detected_type mismatch
    if basic["ext"] and detected_type and basic["ext"] != detected_type:
        risk += 15
        reasons.append(f"Extension '{basic['ext']}' does not match detected type '{detected_type}'")

    # executable mime rule
    if "x-dosexec" in mime or "exe" in mime or detected_type == "exe" or "application/x-msdownload" in mime:
        risk += 20
        reasons.append("File looks like an executable")

    # cap risk
    if risk > 100:
        risk = 100

    # assemble result
    result = {
        "file": basic,
        "mime_type": mime,
        "magic_header": header_hex,
        "detected_type": detected_type,
        "entropy": entropy,
        "image_info": image_info,
        "pdf_info": pdf_info,
        "risk_score": risk,
        "risk_reasons": reasons
    }
    
    #AI analysis layer
    ai_result = ai_threat_analysis(result)
    
    #merge both results
    result["ai_analysis"] = ai_result

    return result
