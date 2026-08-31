import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = content.replace('story_text += f"\n', 'story_text += f"\\n')

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Newline fixed!")
