import codecs

lines = codecs.open('src/features/map/MapModal.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '{selectedHex.terrain}' in l and 'translateTerrain' not in l:
        lines[i] = l.replace('{selectedHex.terrain}', '{translateTerrain(selectedHex.terrain)}')

with codecs.open('src/features/map/MapModal.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
