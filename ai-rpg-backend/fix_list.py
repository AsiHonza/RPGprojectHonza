import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = content.replace('select("api_key, name, race, dnd_class, level, stats")', 'select("api_key, name, race, dnd_class, stats, state")')

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("list-characters fixed.")
