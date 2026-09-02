import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = content.replace("model='gemini-2.5-flash'", "model='gemini-3.5-flash'")

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Model fixed")
