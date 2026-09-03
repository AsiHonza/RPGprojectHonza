import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))' in l:
        lines[i] = l.replace('client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))', 'client = genai.Client(api_key=req.api_key if req.api_key and "DUMMY" not in req.api_key else os.environ.get("GEMINI_API_KEY"))')

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
