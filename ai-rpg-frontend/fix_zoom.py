import codecs

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()

import re

# Add import
for i, l in enumerate(lines):
    if 'import { MapPin, Castle' in l:
        lines.insert(i, 'import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";\n')
        break

# Find the start of the return block
for i, l in enumerate(lines):
    if '<svg ' in l and 'className="cursor-crosshair"' in lines[i+3]:
        # wrap svg
        lines[i-1] = lines[i-1].replace('overflow-auto custom-scrollbar', 'overflow-hidden')
        lines.insert(i, '      <TransformWrapper initialScale={1.5} minScale={0.3} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>\n        <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full flex items-center justify-center">\n')
        break

# Find the end of the svg block
for i, l in enumerate(lines):
    if '</svg>' in l and 'TransformWrapper' in "".join(lines):
        lines.insert(i+1, '        </TransformComponent>\n      </TransformWrapper>\n')
        break

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
