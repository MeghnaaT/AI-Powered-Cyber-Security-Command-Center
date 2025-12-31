from dotenv import load_dotenv
load_dotenv()
import google.generativeai as genai, os, json, traceback
key = os.getenv("GEMINI_API_KEY")
print("GEMINI_API_KEY set?", bool(key))
try:
    genai.configure(api_key=key)
    models = genai.list_models()
    print("LIST MODELS OUTPUT:")
    print(json.dumps(models, indent=2))
except Exception:
    traceback.print_exc()