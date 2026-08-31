import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = content.replace(
    'client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))',
    'client = genai.Client(api_key=req.api_key if req.api_key and req.api_key != "DUMMY" else os.environ.get("GEMINI_API_KEY"))'
)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Client fixed!")
