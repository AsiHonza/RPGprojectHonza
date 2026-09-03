import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'setIsLoggedIn(true);' in l and 'fetchCharacters(email)' in lines[i+1]:
        lines.insert(i+1, '      localStorage.setItem("aethelgard_session_email", email);\n')
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
