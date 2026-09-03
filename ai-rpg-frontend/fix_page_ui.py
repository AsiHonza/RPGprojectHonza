import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    # Fix the global dark gradient on Character Select
    if 'from-slate-900/20 via-slate-950/80 to-slate-950' in l:
        lines[i] = l.replace('from-slate-900/20 via-slate-950/80 to-slate-950', 'from-[#e5dfc5]/20 via-[#f9f6e6]/80 to-[#f9f6e6]')
        
    # Fix the character card gradient (fadeout obdelnik)
    if 'from-black via-black/40 to-transparent' in l:
        lines[i] = l.replace('from-black via-black/40 to-transparent', 'from-[#f9f6e6] via-[#f9f6e6]/90 to-transparent')
        
    # Fix the "Vytvorit Novou Legendu" button
    if 'bg-transparent border border-amber-900/20' in l and 'Vytvo' in "".join(lines[i:i+4]):
        lines[i] = l.replace('bg-transparent border border-amber-900/20', 'bg-white border-2 border-rpg-magic/50 shadow-md hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
