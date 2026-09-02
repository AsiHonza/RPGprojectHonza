import codecs

lines = codecs.open('src/features/map/MapModal.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if "worldData={worldData}" in l:
        lines[i] = "                    worldData={worldData}\n                    setSelectedItem={setSelectedItem}\n"

with codecs.open('src/features/map/MapModal.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
