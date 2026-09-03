import codecs

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'import { motion' in l:
        lines.insert(i+1, 'import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";\n')
        break

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
