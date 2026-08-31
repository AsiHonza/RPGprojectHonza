import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace("onClick={fetchCharacters}", "onClick={() => fetchCharacters()}")

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("fetchCharacters onClick fixed!")
