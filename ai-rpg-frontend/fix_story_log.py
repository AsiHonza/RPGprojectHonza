import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '<div className="flex-1 overflow-hidden relative mb-4">' in l:
        lines[i] = l.replace('<div className="flex-1 overflow-hidden relative mb-4">', '<div className="flex-1 overflow-hidden relative mb-4 w-full max-w-5xl mx-auto z-10">')
    if '<div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-full max-w-5xl z-10 flex flex-col gap-3">' in l:
        lines[i] = l.replace('w-full max-w-5xl z-10', 'w-full max-w-5xl mx-auto z-10')
    if 'bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4' in l:
        lines[i] = l.replace('bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4', 'bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 sm:p-4')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
