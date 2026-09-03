import codecs
import re

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if '<TransformWrapper initialScale=' in l:
        # replace with limitToBounds={false}
        lines[i] = re.sub(r'<TransformWrapper([^>]+)>', r'<TransformWrapper\1 limitToBounds={false}>', l)
        
        # add render props
        lines.insert(i+1, '        {({ zoomIn, zoomOut, resetTransform, setTransform }) => (\n')
        lines.insert(i+2, '          <>\n')
        lines.insert(i+3, '            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-50">\n')
        lines.insert(i+4, '              <button onClick={() => zoomIn()} className="w-10 h-10 bg-rpg-obsidian border border-[#455a64] rounded flex items-center justify-center text-rpg-paper hover:bg-[#2b4c5e] hover:border-rpg-magic shadow-lg transition-all text-xl font-bold">+</button>\n')
        lines.insert(i+5, '              <button onClick={() => zoomOut()} className="w-10 h-10 bg-rpg-obsidian border border-[#455a64] rounded flex items-center justify-center text-rpg-paper hover:bg-[#2b4c5e] hover:border-rpg-magic shadow-lg transition-all text-xl font-bold">-</button>\n')
        lines.insert(i+6, '              <button onClick={() => {\n')
        lines.insert(i+7, '                if (playerLocation) {\n')
        lines.insert(i+8, '                  const targetHex = grid.toArray().find(h => h.q === playerLocation.q && h.r === playerLocation.r);\n')
        lines.insert(i+9, '                  if (targetHex) {\n')
        lines.insert(i+10, '                    const px = targetHex.x + offsetX;\n')
        lines.insert(i+11, '                    const py = targetHex.y + offsetY;\n')
        lines.insert(i+12, '                    const scale = 2;\n')
        lines.insert(i+13, '                    setTransform(-px * scale + (typeof window !== "undefined" ? window.innerWidth / 2 : 400), -py * scale + (typeof window !== "undefined" ? window.innerHeight / 2 : 400), scale, 500);\n')
        lines.insert(i+14, '                  }\n')
        lines.insert(i+15, '                }\n')
        lines.insert(i+16, '              }} className="w-10 h-10 bg-[#2b4c5e] border border-rpg-magic rounded flex items-center justify-center text-rpg-paper hover:bg-rpg-magic hover:text-slate-900 shadow-lg transition-all" title="Centrovat na hráče">\n')
        lines.insert(i+17, '                <User size={20} />\n')
        lines.insert(i+18, '              </button>\n')
        lines.insert(i+19, '            </div>\n')
        break

for i, l in enumerate(lines):
    if '</TransformWrapper>' in l:
        lines.insert(i, '          </>\n')
        lines.insert(i+1, '        )}\n')
        break

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
