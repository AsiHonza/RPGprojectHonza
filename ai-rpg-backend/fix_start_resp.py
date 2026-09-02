import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = content.replace(
    'return {"status": "success", "api_key": api_key, "message": "Úspěšně ses probudil v novém těle.", "intro_text": intro_text, "popis_okoli": popis_okoli}',
    'return {"status": "success", "api_key": api_key, "message": "Úspěšně ses probudil v novém těle.", "intro_text": intro_text, "popis_okoli": popis_okoli, "state": state}'
)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("Updated create-character response.")
