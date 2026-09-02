import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '<div className="ml-auto">' in l and 'deleteCharacter' in "".join(lines[i:i+3]):
        lines[i] = l.replace('<div className="ml-auto">', '<div className="absolute top-4 right-4 z-50">')
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
