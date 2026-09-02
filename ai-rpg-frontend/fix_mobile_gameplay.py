import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'bg-black font-serif relative flex flex-col' in l:
        lines[i] = l.replace('bg-black', 'bg-slate-950')
    if 'from-black via-black/60 to-black/40' in l:
        lines[i] = l.replace('from-black via-black/60 to-black/40', 'from-slate-950 via-slate-950/70 to-slate-900/40')
    if 'flex justify-between items-start mb-4' in l:
        lines[i] = l.replace('flex justify-between items-start', 'flex flex-col md:flex-row justify-between items-start md:items-center gap-4')
    if 'flex flex-wrap items-center justify-end gap-3 max-w-[50%]' in l:
        lines[i] = l.replace('justify-end gap-3 max-w-[50%]', 'justify-start md:justify-end gap-2 md:gap-3 max-w-full md:max-w-[50%]')
    # Story log colors
    if 'bg-black border border-white/5' in l:
        lines[i] = l.replace('bg-black border border-white/5', 'bg-slate-900 border border-white/5')
    
    # Input box mobile styling
    if 'flex gap-3 bg-black/80 backdrop-blur-xl p-3' in l:
        lines[i] = l.replace('gap-3 bg-black/80 backdrop-blur-xl p-3', 'flex-wrap sm:flex-nowrap gap-2 sm:gap-3 bg-slate-900/90 backdrop-blur-xl p-2 sm:p-3')
    if 'px-8 py-2 rounded-xl font-cinzel' in l:
        lines[i] = l.replace('px-8 py-2', 'px-4 sm:px-8 py-2 sm:py-3 w-full sm:w-auto')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
