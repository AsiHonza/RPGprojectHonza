import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if 'if (dm_data.popis_okoli) lastDesc = dm_data.popis_okoli;' in l:
        lines[i] = ''

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
