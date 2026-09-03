import codecs

lines = codecs.open('src/features/ui/PlayerHeader.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if '<span className="text-xs text-rpg-muted font-lora italic leading-none">{race} {dndClass}</span>' in l:
        lines.insert(i+2, '            <div className="text-sm text-[#2b4c5e] font-cinzel mb-1 flex items-center gap-1 font-bold mt-1">\n')
        lines.insert(i+3, '              <MapPin size={14} /> {currentRegion || "Neznámá lokace"}\n')
        lines.insert(i+4, '            </div>\n')
        break

with codecs.open('src/features/ui/PlayerHeader.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
