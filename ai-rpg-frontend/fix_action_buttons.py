import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'bg-white/5 border border-white/20 text-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-white/10' in l:
        lines[i] = l.replace('px-4 py-2 rounded-xl text-sm', 'px-3 py-2 rounded-lg text-xs sm:text-sm text-left shadow-sm')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
