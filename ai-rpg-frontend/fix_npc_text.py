import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if '"{npc.replika}"' in l:
        lines[i] = '                                <div className="text-slate-900">"{npc.text || npc.replika}"</div>\n'
    if 'playAudio(npc.replika' in l:
        lines[i] = lines[i].replace('npc.replika', '(npc.text || npc.replika)')
        lines[i] = lines[i].replace("npc.jmeno.toLowerCase().includes('žen') ? 'npc_zena' : 'npc_muz'", "npc.pohlavi === 'zena' ? 'npc_zena' : 'npc_muz'")

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
