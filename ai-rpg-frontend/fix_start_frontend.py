import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace(
    'setCurrentLocationDesc("Mlha se pomalu rozestupuje a ty před sebou vidíš neznámý hvozd.");',
    'setCurrentLocationDesc(data.popis_okoli || "Neznámé místo.");\n          setCurrentRegion("Začátek cesty");'
)
content = content.replace(
    '{ type: "dm", popis_okoli: "Mlha se pomalu rozestupuje...", vypravec: data.intro_text }',
    '{ type: "dm", popis_okoli: data.popis_okoli, vypravec: data.intro_text }'
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Frontend intro fixed!")
