import codecs

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()
in_terrain = False
for i, l in enumerate(lines):
    if 'const TerrainIcon = ' in l:
        in_terrain = True
    if 'const POIIcon = ' in l:
        in_terrain = False
    
    if in_terrain and 'size={20}' in l:
        lines[i] = l.replace('size={20}', 'size={16}')

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
