import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace('alert("Chyba připojení k serveru.");', 'console.error(err); alert("Chyba připojení k serveru.");')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Added console error")
