import codecs

lines = codecs.open('src/features/character/CharacterCreation.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'text-[#e5e7eb]' in l:
        lines[i] = l.replace('text-[#e5e7eb]', 'text-slate-900')
    if 'placeholder-white/20' in l:
        lines[i] = l.replace('placeholder-white/20', 'placeholder-slate-400')
    if "text-rpg-magic" in l and "bg-rpg-magic/20" in l:
        # Increase the contrast for selected items by adding font-bold and a darker magic text maybe?
        # Actually amber-600 should be visible, but let's make it font-bold text-amber-700
        lines[i] = l.replace('text-rpg-magic', 'text-amber-800 font-bold bg-amber-100')

with codecs.open('src/features/character/CharacterCreation.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
