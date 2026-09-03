import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '<div className="flex flex-wrap gap-2">' in l and 'suggestedActions' in "".join(lines[i-3:i]):
        lines[i] = l.replace('<div className="flex flex-wrap gap-2">', '<div className="flex flex-nowrap overflow-x-auto snap-x gap-2 custom-scrollbar pb-2">')
    
    # We also need to add whitespace-nowrap and flex-shrink-0 to all the action buttons in that block
    if 'className="bg-white/5 border border-white/20 text-gray-300 px-3 py-2 rounded-lg text-xs sm:text-sm text-left shadow-sm' in l:
        lines[i] = l.replace('className="bg-white/5 border border-white/20 text-gray-300 px-3 py-2 rounded-lg text-xs sm:text-sm text-left shadow-sm', 'className="flex-shrink-0 snap-start bg-white/5 border border-white/20 text-gray-300 px-4 py-3 rounded-xl text-sm whitespace-nowrap shadow-sm max-w-[85vw] overflow-hidden text-ellipsis')
    
    if 'className="bg-rpg-magic/10 border border-rpg-magic/50 text-rpg-magic px-4 py-2 rounded-xl text-sm' in l:
        lines[i] = l.replace('className="bg-rpg-magic/10 border border-rpg-magic/50 text-rpg-magic px-4 py-2 rounded-xl text-sm', 'className="flex-shrink-0 snap-start whitespace-nowrap bg-rpg-magic/10 border border-rpg-magic/50 text-rpg-magic px-4 py-3 rounded-xl text-sm')
        
    if 'className="bg-rpg-blood/20 border border-rpg-blood/50 text-red-300 px-4 py-2 rounded-xl text-sm' in l:
        lines[i] = l.replace('className="bg-rpg-blood/20 border border-rpg-blood/50 text-red-300 px-4 py-2 rounded-xl text-sm', 'className="flex-shrink-0 snap-start whitespace-nowrap bg-rpg-blood/20 border border-rpg-blood/50 text-red-300 px-4 py-3 rounded-xl text-sm')

    if 'className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-xl text-sm' in l:
        lines[i] = l.replace('className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-xl text-sm', 'className="flex-shrink-0 snap-start whitespace-nowrap bg-white/5 border border-white/20 text-white px-4 py-3 rounded-xl text-sm')

    if 'className="bg-black/40 border border-gray-600 text-gray-400 px-4 py-2 rounded-xl text-sm' in l:
        lines[i] = l.replace('className="bg-black/40 border border-gray-600 text-gray-400 px-4 py-2 rounded-xl text-sm', 'className="flex-shrink-0 snap-start whitespace-nowrap bg-black/40 border border-gray-600 text-gray-400 px-4 py-3 rounded-xl text-sm')


with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
