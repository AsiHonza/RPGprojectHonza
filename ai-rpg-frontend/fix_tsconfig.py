import codecs

lines = codecs.open('tsconfig.json', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '"strict": true' in l:
        lines.insert(i+1, '    "noImplicitAny": false,\n')
        break

with codecs.open('tsconfig.json', 'w', 'utf-8') as f:
    f.write("".join(lines))
