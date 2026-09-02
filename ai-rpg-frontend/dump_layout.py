import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

start = content.find('if (gameState === "playing")')
end = content.find('{showInventory && (', start)

print(content[start:end])
