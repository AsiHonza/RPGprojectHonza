import codecs
import re

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if '<TransformWrapper initialScale=' in l:
        lines[i] = re.sub(r'wheel=\{\{\s*step:\s*0\.1\s*\}\}', 'wheel={{ step: 0.05 }}', l)
        break

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
