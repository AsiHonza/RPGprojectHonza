import codecs

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()

# We need to replace foreignObject blocks with g blocks.
for i, l in enumerate(lines):
    # Terrain Ink Icon
    if '{!hexData.poi && (' in l:
        lines[i+1] = '                    <g transform={`translate(${x - 8}, ${y - 8})`} className="pointer-events-none opacity-70 mix-blend-multiply">\n'
        lines[i+2] = '                      {getTerrainIcon(hexData.terrain)}\n'
        lines[i+3] = '                    </g>\n'
        lines[i+4] = ''
        lines[i+5] = ''
        lines[i+6] = ''
        lines[i+7] = ''
        lines[i+8] = ''
        lines[i+9] = ''

    # Player Pawn
    if '{playerLocation?.q === hexData.q && playerLocation?.r === hexData.r && (' in l:
        lines[i+1] = '                    <g transform={`translate(${x - 12}, ${y - 12})`} className="pointer-events-none z-50 animate-bounce text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.9)]">\n'
        lines[i+2] = '                      <User size={24} strokeWidth={3} />\n'
        lines[i+3] = '                    </g>\n'
        lines[i+4] = ''
        lines[i+5] = ''
        lines[i+6] = ''
        lines[i+7] = ''
        lines[i+8] = ''
        lines[i+9] = ''

    # POI Icon
    if '{hexData.poi && (' in l:
        lines[i+1] = '                    <g transform={`translate(${x - 10}, ${y - 10})`} className="pointer-events-none z-10">\n'
        lines[i+2] = '                      {getPoiIcon(hexData.poi)}\n'
        lines[i+3] = '                    </g>\n'
        lines[i+4] = ''
        lines[i+5] = ''
        lines[i+6] = ''
        lines[i+7] = ''
        lines[i+8] = ''
        lines[i+9] = ''

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
