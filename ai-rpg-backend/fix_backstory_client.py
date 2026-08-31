import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

target = "client = genai.Client(api_key=req.api_key)"
replacement = 'client = genai.Client(api_key=req.api_key if req.api_key and "DUMMY" not in req.api_key else os.environ.get("GEMINI_API_KEY"))'

content = content.replace(target, replacement)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Backstory client fixed!")
