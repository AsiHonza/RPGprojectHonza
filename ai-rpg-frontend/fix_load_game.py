import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'const loadGame = async (characterName: string) => {' in l:
        lines[i] = '  const loadGame = async (characterName: string, overrideEmail: string = email) => {\n'
    if 'if (!email || !characterName)' in l and 'alert(' in l:
        lines[i] = '    if (!overrideEmail || !characterName) return alert("Přihlaste se a vyberte postavu!");\n'
    if 'body: JSON.stringify({ email: email, api_key: "DUMMY", name: characterName }),' in l:
        lines[i] = '        body: JSON.stringify({ email: overrideEmail, api_key: "DUMMY", name: characterName }),\n'
    if 'setGameState("playing");' in l and 'loadGame' in "".join(lines[max(0, i-100):i]):
        lines.insert(i+1, '        localStorage.setItem("aethelgard_active_char", characterName);\n')
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
