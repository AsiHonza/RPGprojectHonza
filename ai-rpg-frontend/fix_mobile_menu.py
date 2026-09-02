import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'className="text-6xl md:text-8xl font-bold text-rpg-magic' in l:
        lines[i] = l.replace('text-6xl md:text-8xl', 'text-4xl sm:text-5xl md:text-7xl lg:text-8xl').replace('tracking-[0.2em]', 'tracking-widest md:tracking-[0.2em]')
        break

for i, l in enumerate(lines):
    if 'bg-black text-white' in l and 'gameState === "menu"' in "".join(lines[max(0, i-5):i]):
        lines[i] = l.replace('bg-black text-white', 'bg-slate-950 text-white')
        
for i, l in enumerate(lines):
    if 'from-black/20 via-black/80 to-black' in l:
        lines[i] = l.replace('from-black/20 via-black/80 to-black', 'from-slate-900/20 via-slate-950/80 to-slate-950')
        
for i, l in enumerate(lines):
    if 'dark%20fantasy%20portrait' in l:
        lines[i] = l.replace('dark%20fantasy%20portrait', 'epic%20high%20fantasy%20portrait')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
