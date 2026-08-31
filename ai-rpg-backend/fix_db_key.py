import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

target = 'api_key = f"{req.email}#{req.name}" if req.email else req.api_key'
replacement = 'api_key = f"{req.email}#{req.name}" if req.email else req.api_key\n        db_key = api_key'

content = content.replace(target, replacement)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("db_key fixed!")
