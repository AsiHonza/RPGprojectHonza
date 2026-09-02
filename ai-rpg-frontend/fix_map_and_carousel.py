import codecs

# 1. Fix MapModal
lines = codecs.open('src/features/map/MapModal.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if 'className="absolute inset-0 bg-black/80 z-[100]' in l:
        lines[i] = l.replace('absolute inset-0 bg-black/80 z-[100] flex items-center justify-center p-2 md:p-8', 'fixed inset-0 z-[100] flex items-center justify-center bg-black')
    if 'bg-[#e3dcc8] w-full h-full max-h-screen max-w-6xl' in l:
        lines[i] = l.replace('max-w-6xl rounded shadow-2xl relative overflow-hidden', 'relative overflow-hidden w-full h-full')

with codecs.open('src/features/map/MapModal.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))


# 2. Fix page.tsx (Carousel + Delete button)
lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto z-10 px-4"' in l:
        lines[i] = l.replace('grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4', 'flex overflow-x-auto snap-x snap-mandatory pb-8 custom-scrollbar')
    if 'group relative bg-slate-900 border border-white/10' in l:
        lines[i] = l.replace('group relative bg-slate-900', 'group relative bg-slate-900 min-w-[280px] sm:min-w-[320px] snap-center shrink-0')
    if 'ml-auto' in l and '<Flame size={20} />' in "".join(lines[i:i+3]):
        lines[i] = l.replace('className="ml-auto"', 'className="absolute top-4 right-4 z-50 bg-red-900/50 hover:bg-red-900 p-2 rounded-full border border-red-500/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
