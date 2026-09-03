import codecs

lines = codecs.open('src/features/character/CharacterCreation.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if '{/* Background Glow */}' in l:
        lines[i] = '        <video src="/video/bg1.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-50 mix-blend-multiply" />\n' + l
        break

with codecs.open('src/features/character/CharacterCreation.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
