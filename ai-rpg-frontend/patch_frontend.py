import codecs

# Fix HexMap.tsx
lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if "import { Grid, defineHex, rectangle } from 'honeycomb-grid';" in l:
        lines[i] = "import { Grid, defineHex, rectangle, Orientation } from 'honeycomb-grid';\n"
    if "class CustomHex extends defineHex({ dimensions: HEX_SIZE, orientation: 'pointy' }) {}" in l:
        lines[i] = "class CustomHex extends defineHex({ dimensions: HEX_SIZE, orientation: Orientation.POINTY }) {}\n"

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))

# Fix MapModal.tsx
lines2 = codecs.open('src/features/map/MapModal.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines2):
    if "<HexMap" in l and "worldData={worldData}" in l:
        if "setSelectedItem" not in l:
            lines2[i] = l.replace("/>", " setSelectedItem={setSelectedItem} />")

with codecs.open('src/features/map/MapModal.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines2))
