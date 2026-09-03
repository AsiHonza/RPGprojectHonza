import codecs

lines = codecs.open('src/features/character/CharacterCreation.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if 'className="min-h-screen bg-[#e5dfc5]' in l:
        lines[i] = '    <div className="min-h-screen bg-black text-slate-900 flex flex-col items-center justify-center p-4 overflow-y-auto overflow-x-hidden relative">\n'
    if '<video src="/video/bg1.mp4"' in l:
        lines[i] = '        <video src="/video/bg1.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-60" />\n'

with codecs.open('src/features/character/CharacterCreation.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
