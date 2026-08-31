import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = content.replace(
    'select("api_key, name, race, dnd_class, level, stats")',
    'select("api_key, name, race, dnd_class, stats, state")'
)

content = content.replace(
    'select("id").eq("api_key", api_key)',
    'select("api_key").eq("api_key", api_key)'
)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("DB Queries fixed!")
