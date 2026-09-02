import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '<div className="flex flex-wrap justify-center gap-6 max-w-5xl">' in l:
        lines[i] = l.replace(
            '<div className="flex flex-wrap justify-center gap-6 max-w-5xl">',
            '<div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-6 w-[100vw] sm:w-full max-w-7xl pb-8 px-4 custom-scrollbar justify-start items-center">'
        )
    if 'className="group relative bg-slate-900 border border-white/10 p-6 rounded-2xl' in l:
        lines[i] = l.replace(
            'className="group relative bg-slate-900 border border-white/10',
            'className="group relative bg-slate-900 min-w-[280px] sm:min-w-[320px] snap-center shrink-0 border border-white/10'
        )

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
