import codecs

lines = codecs.open('src/features/character/CharacterCreation.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'bg-[#0a0a0a]' in l:
        lines[i] = l.replace('bg-[#0a0a0a]', 'bg-slate-950')
    if 'text-4xl font-cinzel text-rpg-magic' in l:
        lines[i] = l.replace('text-4xl', 'text-2xl sm:text-4xl text-center md:text-left')
    if 'grid grid-cols-2 md:grid-cols-4 gap-4' in l:
        lines[i] = l.replace('gap-4', 'gap-2 sm:gap-4')
    if 'grid grid-cols-3 md:grid-cols-4 gap-3' in l:
        lines[i] = l.replace('gap-3', 'gap-2 sm:gap-3')
    if 'p-8 md:p-12' in l:
        lines[i] = l.replace('p-8 md:p-12', 'p-4 sm:p-8 md:p-12')

with codecs.open('src/features/character/CharacterCreation.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
