import codecs

lines = codecs.open('src/features/character/CharacterCreation.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'className="px-6 bg-white/50 text-amber-800 font-bold bg-amber-100 border border-rpg-magic/50 rounded-xl hover:bg-rpg-magic/20 transition disabled:opacity-50 flex flex-col items-center justify-center gap-2"' in l:
        lines[i] = l.replace('px-6 bg-white/50 text-amber-800 font-bold bg-amber-100 border border-rpg-magic/50 rounded-xl hover:bg-rpg-magic/20', 'px-6 bg-transparent text-amber-800 font-bold border border-amber-900/30 rounded-xl hover:bg-amber-900/10 hover:border-amber-900/50 hover:shadow-md cursor-pointer')
        break

with codecs.open('src/features/character/CharacterCreation.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
