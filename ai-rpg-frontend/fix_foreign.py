import codecs

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if 'x={x' in l and 'foreignObject' in "".join(lines[max(0, i-5):i]):
        lines[i] = '                    x={x}\n'
    if 'y={y' in l and 'foreignObject' in "".join(lines[max(0, i-5):i]):
        lines[i] = '                    y={y}\n'
    if 'width=' in l and 'foreignObject' in "".join(lines[max(0, i-5):i]):
        lines[i] = '                    width={28}\n'
    if 'height=' in l and 'foreignObject' in "".join(lines[max(0, i-5):i]):
        lines[i] = '                    height={32}\n'
        
    # Also fix text element!
    if 'x={x + HEX_SIZE}' in l and 'text' in lines[i-1]:
        lines[i] = '                    x={x + 13.85}\n'
    if 'y={y + HEX_SIZE * 0.866 + 18}' in l and 'text' in lines[i-2]:
        lines[i] = '                    y={y + 16 + 14}\n'

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
