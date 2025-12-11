from transformers import pipeline  #Transformers is a hugging face library for pretrained NLP models, pipeline is a high level API

# Load pretrained phishing/spam detection model
phishing_detector = pipeline(
    "text-classification", #sets up text calssification task
    model="mrm8488/bert-tiny-finetuned-sms-spam-detection"
)
def detect_phishing(text): #input:text (string to analyze)
    result = phishing_detector(text)[0] #runs the model, returns a lsit of predictions ,[0] takes the first prediction

    return{
        "label" : result["label"], #"label" is predicted class
        "confidence": round(result["score"] * 100,2) #model's confidence score, converted to a precentage and rounded to 2 decimals
    }

