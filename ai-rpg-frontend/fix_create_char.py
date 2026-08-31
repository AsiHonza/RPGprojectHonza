import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace(
    'body: JSON.stringify({ name, dnd_class: dndClass, race, stats, api_key: apiKey.trim() }),',
    'body: JSON.stringify({ name, dnd_class: dndClass, race, stats, email: email, api_key: apiKey.trim() || "DUMMY" }),'
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("create character payload fixed.")
