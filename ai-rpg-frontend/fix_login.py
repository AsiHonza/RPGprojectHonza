import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'placeholder-white/30' in l:
        lines[i] = l.replace('placeholder-white/30', 'placeholder-slate-400')
    if 'text-rpg-magic' in l and 'Vstoupit' in ''.join(lines[i:i+4]) and 'bg-white/50' in l:
        lines[i] = l.replace('text-rpg-magic', 'text-slate-800')
        lines[i] = lines[i].replace('border-rpg-magic/50', 'border-amber-900/50')
        lines[i] = lines[i].replace('hover:bg-rpg-magic/20', 'hover:bg-white/70')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
