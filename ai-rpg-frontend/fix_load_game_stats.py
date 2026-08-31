import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace('if (state.stats) setStats(state.stats);', 'if (data.character.stats) setStats(data.character.stats);')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("loadGame stats fixed!")
