import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace("locationType !== 'mesto'", "locationType === 'mesto'")

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("UI fixed!")
