import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '<div className="mb-12 text-center">' in l:
        lines[i] = l.replace('mb-12', 'mb-6 sm:mb-12')
    if '<p className="text-slate-700 font-lora text-xl tracking-widest mt-4 uppercase">' in l:
        lines[i] = l.replace('text-xl tracking-widest mt-4', 'text-sm sm:text-xl tracking-widest mt-2 sm:mt-4')
    if 'className="w-full flex flex-col items-center gap-8"' in l:
        lines[i] = l.replace('gap-8', 'gap-4 sm:gap-8')
    if 'className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-6 w-[100vw] sm:w-full max-w-7xl pb-8 px-4 custom-scrollbar justify-start items-center"' in l:
        lines[i] = l.replace('pb-8', 'pb-4 sm:pb-8')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
