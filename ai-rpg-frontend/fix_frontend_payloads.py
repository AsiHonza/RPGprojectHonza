import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Fix loadGame
content = content.replace(
    'body: JSON.stringify({ api_key: apiKey.trim(), name: characterName }),', 
    'body: JSON.stringify({ email: email, api_key: apiKey.trim() || "DUMMY", name: characterName }),'
)
# Also fix `if (!apiKey || !characterName) return alert("Zadejte API klíč a jméno!");`
content = content.replace(
    'if (!apiKey || !characterName) return alert("Zadejte API klíč a jméno!");',
    'if (!email || !characterName) return alert("Přihlaste se a vyberte postavu!");'
)

# Check createCharacter
content = content.replace(
    'body: JSON.stringify({ name, dnd_class: dndClass, race, stats, api_key: apiKey.trim(), keywords }),',
    'body: JSON.stringify({ name, dnd_class: dndClass, race, stats, email: email, api_key: apiKey.trim() || "DUMMY", keywords }),'
)

# Check sendAction
content = content.replace(
    'body: JSON.stringify({ api_key: apiKey.trim(), name, action_text: action, stats }),',
    'body: JSON.stringify({ email: email, api_key: apiKey.trim() || "DUMMY", name, action_text: action, stats }),'
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Payloads fixed!")
