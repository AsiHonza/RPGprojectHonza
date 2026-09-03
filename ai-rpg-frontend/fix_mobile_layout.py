import codecs

lines = codecs.open('src/features/character/CharacterCreation.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    # Fix Races Grid to be horizontal scroll on mobile
    if '<div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">' in l:
        lines[i] = '                  <div className="flex overflow-x-auto snap-x md:grid md:grid-cols-4 gap-2 sm:gap-4 pb-2 custom-scrollbar">\n'
    if 'key={r}' in l and 'button' in lines[i-1] and 'className=' in lines[i+1]:
        # Need to add shrink-0 snap-center min-w-[120px] to buttons in race
        if 'className={`p-4 rounded-xl border-2' in lines[i+1]:
            lines[i+1] = lines[i+1].replace('className={`p-4 rounded-xl border-2', 'className={`shrink-0 snap-center min-w-[140px] md:min-w-0 p-4 rounded-xl border-2')

    # Fix Classes Grid to be horizontal scroll on mobile
    if '<div className="grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 max-h-48 overflow-y-auto custom-scrollbar p-1">' in l:
        lines[i] = '                  <div className="flex overflow-x-auto snap-x md:grid md:grid-cols-4 gap-2 sm:gap-3 md:max-h-48 md:overflow-y-auto custom-scrollbar p-1 pb-4">\n'
    if 'key={c}' in l and 'button' in lines[i-1] and 'className=' in lines[i+1]:
        if 'className={`p-3 rounded-xl border-2' in lines[i+1]:
            lines[i+1] = lines[i+1].replace('className={`p-3 rounded-xl border-2', 'className={`shrink-0 snap-center min-w-[120px] md:min-w-0 p-3 rounded-xl border-2')

    # Fix Attributes Grid
    if '<div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">' in l:
        lines[i] = '                  <div className="flex overflow-x-auto snap-x md:grid md:grid-cols-6 gap-2 sm:gap-4 text-center pb-2 custom-scrollbar">\n'
    if 'key={stat} className="bg-[#f9f6e6]/70 p-3 rounded-lg border border-amber-900/10"' in l:
        lines[i] = lines[i].replace('className="bg-[#f9f6e6]/70 p-3', 'className="shrink-0 snap-center min-w-[80px] md:min-w-0 bg-[#f9f6e6]/70 p-3')

    # Make overall wrapper scrollable instead of hidden
    if '<div className="min-h-screen bg-[#e5dfc5] bg-[url(\'https://www.transparenttextures.com/patterns/black-scales.png\')] text-slate-900 flex flex-col items-center justify-center p-4 overflow-hidden relative">' in l:
        lines[i] = l.replace('overflow-hidden', 'overflow-y-auto overflow-x-hidden')

with codecs.open('src/features/character/CharacterCreation.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
