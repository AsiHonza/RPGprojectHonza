import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

old_save = """        body: JSON.stringify({
          api_key: apiKey.trim(),
          state: {"""
new_save = """        body: JSON.stringify({
          email: email,
          name: name,
          state: {"""

content = content.replace(old_save, new_save)
# also `if (gameState !== "playing" || !apiKey) return;`
content = content.replace('if (gameState !== "playing" || !apiKey) return;', 'if (gameState !== "playing" || !email || !name) return;')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("save-state fixed!")
