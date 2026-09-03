from google import genai
import os

try:
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    models = client.models.list()
    print("Available models:")
    for m in models:
        print(m.name)
except Exception as e:
    print(f"Error: {e}")
