import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = content.replace(
    '        # Pidn aktuln akce s kontextem',
    '        relevant_memories = ""\n        # Pidn aktuln akce s kontextem'
)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Memories fixed!")
