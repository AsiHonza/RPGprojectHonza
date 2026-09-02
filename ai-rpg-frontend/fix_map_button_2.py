import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '{worldData && <button onClick={() => setMapOpen(true)}' in l:
        lines[i] = l.replace('{worldData && <button', '<button').replace('}</button>}', '}</button>')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
