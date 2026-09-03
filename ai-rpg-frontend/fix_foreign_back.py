import codecs

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if 'x={x}' in l and 'foreignObject' in "".join(lines[max(0, i-5):i]):
        lines[i] = '                      x={x - 14}\n'
    if 'y={y}' in l and 'foreignObject' in "".join(lines[max(0, i-5):i]):
        lines[i] = '                      y={y - 16}\n'
        
    # Also fix text element!
    if 'x={x + 13.85}' in l and 'text' in lines[i-1]:
        lines[i] = '                      x={x}\n'
    if 'y={y + 16 + 14}' in l and 'text' in lines[i-2]:
        lines[i] = '                      y={y + 14}\n'

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
