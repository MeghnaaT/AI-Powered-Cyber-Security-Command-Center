# 🛡️ AI-Powered Cyber Security Command Center

<div align="center">

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.2-green.svg)](https://flask.palletsprojects.com/)
[![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()

**An intelligent, educational cybersecurity platform for threat detection, phishing analysis, and security awareness training.**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture)

</div>

---

## 📋 Overview

AI-Powered Cyber Security Command Center is a **production-ready educational platform** that combines static file analysis, ML-based phishing detection, and interactive security training. Built with Flask and Hugging Face Transformers, it provides explainable AI-driven threat assessments suitable for SOCs, security training, and cybersecurity education.

### Key Highlights
✨ **BERT-based Phishing Detection** using Hugging Face transformers  
🔍 **Advanced File Threat Analysis** with magic number & entropy detection  
🔐 **Real-time Password Strength Assessment** with actionable feedback  
📊 **Explainable AI Layer** for threat interpretation  
🎯 **Interactive Security Training** with simulated attacks  
⚡ **Fast, Lightweight & Safe** - no file execution, memory-safe analysis

---

## 🎯 Features

### 📁 Advanced File Threat Scanner
*Analyzes file headers, entropy, and metadata to detect malicious or suspicious files without executing them.*

**Deep static file analysis with multiple detection vectors:**

- **Magic Number Detection** - Identifies 7+ file types (JPEG, PNG, PDF, ZIP, EXE, ELF, etc.)
- **Shannon Entropy Analysis** - Detects encrypted/packed payloads
- **MIME Type Detection** - Uses libmagic for accurate content validation
- **Metadata Extraction** - Pulls EXIF from images, page count from PDFs
- **Risk Scoring** - Heuristic-based threat assessment (0-100)
- **Extension Mismatch Detection** - Flags mismatched file types
- **Hash-based Analysis** - SHA256 fingerprinting for file tracking

**Example Output:**
```json
{
  "filename": "document.pdf",
  "size": "99061 bytes",
  "detected_type": "PDF Document",
  "entropy": "0.22%",
  "magic number" :  "255044462D312E34",
  "Status": "OK"
}
```

### 🎣 AI-Powered Phishing Detector
*Detects phishing URLs and spam messages using BERT-based ML and advanced domain impersonation checks.*

**Dual-layer phishing detection combining URL analysis & ML:**

- **Hugging Face BERT Model** - `mrm8488/bert-tiny-finetuned-sms-spam-detection`
- **URL Structural Analysis** - Detects suspicious domains & patterns
- **Brand Impersonation Detection** - Identifies lookalike domains
- **Homoglyph Detection** - Catches visual tricks (rn → m, 0 → O)
- **Suspicious TLD Detection** - Flags risky domains (.tk, .ml, .cf, .gq, .zip)
- **Risk Scoring** - Multi-factor threat assessment (0-100)

**Risk Thresholds:**
- ≥ 60: High Risk 🚩 Likely Phishing
- 30-60: Suspicious ⚠️
- < 30: Likely Safe ✅

### 🔐 Password Strength Analyzer
*Evaluates password strength by scoring length, complexity, and character variety with personalized feedback.*

**Intelligent password evaluation with character-level analysis:**

| Criterion | Points | Requirement |
|-----------|--------|-------------|
| Length | 30 pts | ≥ 12 characters |
| Uppercase | 20 pts | A-Z present |
| Lowercase | 20 pts | a-z present |
| Numbers | 15 pts | 0-9 present |
| Special Characters | 15 pts | !@#$%^&*()-_+= |
| **Total** | **100 pts** | Strength score |

**Strength Levels:**
- 0-49: Weak
- 50-79: Moderate
- 80-100: Strong

### 🎯 Phishing Awareness Training
*Provides interactive simulations of phishing attacks to educate users on recognizing and avoiding threats.*

- Interactive phishing simulation environment
- Educational attack scenarios
- Safe, controlled testing ground
- Logs and feedback for learning

### 🌐 Live Network Attack Visualizer
*Displays simulated network attacks with source IPs and attack types for security awareness and SOC training.*

- Real-time attack log display
- Simulated attack types: port scans, brute force, suspicious downloads
- Source IP tracking
- Attack timeline visualization

---

## 🏗️ Architecture & Design

### Multi-Layered Threat Analysis Model

```
┌─────────────────────────────────────────────┐
│     Explainable AI Threat Assessment        │
├─────────────────────────────────────────────┤
│  • ML-based classification (Hugging Face)   │
│  • Rule-based heuristics                    │
│  • Risk confidence scoring                  │
├─────────────────────────────────────────────┤
│        Static File Analysis Layer           │
├─────────────────────────────────────────────┤
│  • Magic number signature matching          │
│  • Entropy-based anomaly detection          │
│  • MIME type validation                     │
│  • Metadata extraction                      │
│  • Extension consistency checking           │
├─────────────────────────────────────────────┤
│      URL & Phishing Analysis Layer          │
├─────────────────────────────────────────────┤
│  • Domain impersonation detection           │
│  • URL structural risk assessment           │
│  • TLD reputation checking                  │
│  • BERT text classification                 │
└─────────────────────────────────────────────┘
```

### Core Components

| Module | Purpose | Key Features |
|--------|---------|--------------|
| `app.py` | Flask API server | 5 endpoints, CORS, logging |
| `file_analyzer.py` | File threat analysis | Magic detection, entropy, metadata |
| `phishing_ai.py` | BERT model integration | ML inference, confidence scoring |
| `ai_engine.py` | Explainable AI layer | Rule-based threat assessment |
| `entropy.py` | Shannon entropy calculation | Byte sequence analysis |

### Tech Stack
- **Backend:** Flask 3.1.2, Python 3.8+
- **AI/ML:** Hugging Face Transformers, BERT-tiny
- **File Analysis:** python-magic, Pillow, PyPDF2
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Data:** NumPy, OpenCV (optional visual analysis)

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.8 or higher**
- **pip** (Python package manager)
- **~500MB disk space** (includes Hugging Face model cache)



### First Test

**Try the file scanner:**
1. Navigate to "📁 File Threat Scanner"
2. Upload any file (PDF, image, EXE, etc.)
3. View detailed analysis including entropy, detected type, and AI risk assessment

**Test phishing detection:**
1. Go to "🎣 AI Phishing Detector"
2. Paste: ` http://pay-pal.tk`
3. See risk score and detailed threat indicators

---

## 📂 Project Structure

```
cyber_file_analyzer/
│
├── app.py                          # Flask application & API routes
├── file_analyzer.py                # File threat analysis engine
├── phishing_ai.py                  # Hugging Face BERT integration
├── ai_engine.py                    # Explainable AI threat assessment
├── requirements.txt                # Python dependencies (24 packages)
│
├── utils/
│   └── entropy.py                  # Shannon entropy calculator
│
├── static/
│   ├── style.css                   # Responsive dark/light theme CSS
│   └── script.js                   # Client-side API handlers
│
├── templates/
│   └── index.html                  # Main web interface
│
├── uploads/                        # Temporary file storage (created at runtime)
├── logs/                           # Application logs (created at runtime)
└── README.md                       # This file
```

---

## 🔌 API Reference

### File Analysis
**Endpoint:** `POST /scan-file`

**Request:**
```bash
curl -X POST -F "file=@/path/to/file" http://127.0.0.1:5000/scan-file
```

**Response:**
```json
{
  "filename": "document.pdf",
  "size_bytes": 245891,
  "detected_type": "pdf",
  "byte_diversity": 7.234,
  "entropy_percentage": "90.42%",
  "magic_number": "25504446",
  "status": "ok"
}
```

---

### Phishing Analysis
**Endpoint:** `POST /analyze-phishing`

**Request:**
```bash
curl -X POST http://127.0.0.1:5000/analyze-phishing \
  -H "Content-Type: application/json" \
  -d '{"text":"Verify your bank account at http://secure-bank.tk"}'
```

**Response:**
```json
{
  "verdict": "High Risk 🚩 Likely Phishing",
  "risk_score": 65,
  "reasons": [
    "Suspicious TLD: .tk",
    "Looks like fake version of bank.com",
    "Contains @ symbol"
  ]
}
```

---

### Password Analysis
**Endpoint:** `POST /check-password`

**Request:**
```bash
curl -X POST http://127.0.0.1:5000/check-password \
  -H "Content-Type: application/json" \
  -d '{"password":"P@ssw0rd123!"}'
```

**Response:**
```json
{
  "score": 100,
  "strength": "Strong",
  "feedback": []
}
```

---

### Attack Visualization
**Endpoint:** `GET /view-attacks`

**Response:**
```json
{
  "attacks": [
    {"time": "10:01", "type": "Port scan", "src": "192.168.1.5"},
    {"time": "10:02", "type": "Brute force", "src": "45.12.89.34"},
    {"time": "10:03", "type": "Suspicious download", "src": "103.45.22.9"}
  ]
}
```

---

### Phishing Training
**Endpoint:** `GET /start-simulation`

**Response:**
```json
{
  "message": "Simulation started — a fake phishing email was generated (educational only)."
}
```

---

## 📊 Performance & Specifications

| Metric | Value |
|--------|-------|
| File Upload Limit | No hard limit (configurable) |
| Analysis Speed | < 1 second per file |
| BERT Inference Time | < 500ms per URL |
| Memory Usage | ~1.5GB (BERT model loaded) |
| Supported File Types | 7+ (JPEG, PNG, PDF, ZIP, EXE, ELF, etc.) |
| Concurrent Users | 10+ (development mode) |

---

## 🎓 Use Cases

### 1. **Cybersecurity Education**
- Teach students file format analysis
- Demonstrate phishing detection techniques
- Train security professionals on threat assessment

### 2. **Enterprise Training**
- Security awareness programs
- Phishing simulation exercises
- File threat handling procedures

### 3. **SOC/Security Operations**
- Initial triage of suspicious files
- Phishing email analysis
- Educational training environment

### 4. **Development & Research**
- Study Flask + ML integration
- Learn about static analysis techniques
- Explore Hugging Face model deployment

---

## 🔒 Security Considerations

| Aspect | Details |
|--------|---------|
| **File Execution** | ✅ **Safe** - Static analysis only, no execution |
| **Data Retention** | ✅ **Secure** - Files not stored permanently |
| **CORS Policy** | ✅ **Enabled** - Safe cross-origin API access |
| **Input Validation** | ✅ **Enforced** - All inputs sanitized |
| **Logging** | ✅ **Enabled** - For audit trails |
| **HTTPS** | ⚠️ Development mode (use reverse proxy for production) |
| **Authentication** | ⚠️ None (educational tool, deploy with auth layer) |

---

## 📦 Dependencies

**Core Dependencies:**
- Flask 3.1.2 - Web framework
- transformers - Hugging Face models
- pillow - Image processing
- PyPDF2 - PDF reading
- python-magic - File type detection
- opencv-python - Image analysis
- numpy - Numerical computing

See `requirements.txt` for complete list (24 packages total).


## 👤 Author

**Meghna Tiwari**  
📧 Email: [meghnatw24@gmail.com](mailto:meghnatw24@gmail.com)  
🔗 LinkedIn: [meghna-tiwari-m24](https://www.linkedin.com/in/meghna-tiwari-m24/)

---

## 📞 Support & Issues

- 🐛 **Report a Bug:** [GitHub Issues](https://github.com/MeghnaaT/Cyber-File-Analyzer/issues)
- 💬 **Ask a Question:** Start a discussion or email
- 📚 **Read Docs:** Check [THREAT_MODEL.md](THREAT_MODEL.md) for architecture details

---

## ⚖️ Disclaimer

> **⚠️ Educational Purpose Only**
> 
> This tool is designed for **educational and authorized security testing only**. Users are responsible for complying with all applicable laws and regulations. Unauthorized access to computer systems is illegal. Always obtain proper authorization before testing any systems.

---

<div align="center">

**Made with ❤️ for the cybersecurity community**

[⬆ back to top](#-ai-powered-cyber-security-command-center)

</div>
