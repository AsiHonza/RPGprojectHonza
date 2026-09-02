import codecs

lines = codecs.open('src/features/map/MapModal.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if "import { HexMap }" in l:
        lines[i] = "import HexMap from '../../components/map/HexMap';\n"
        break

with codecs.open('src/features/map/MapModal.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
