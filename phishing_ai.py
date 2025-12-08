from transformers import pipeline

# Load pretrained phishing/spam detection model
phishing_detector = pipeline(
    "text-classification",
    model="mrm8488/bert-tiny-finetuned-sms-spam-detection"
)
def detect_phishing(text):
    result = phishing_detector(text)[0]

    return{
        "label" : result["label"],
        "confidence": round(result["score"] * 100,2)
    }

