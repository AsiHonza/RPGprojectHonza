import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if '<div className="absolute inset-0 bg-gradient-to-b from-[#e5dfc5]/20 via-[#f9f6e6]/80 to-[#f9f6e6] z-0 pointer-events-none" />' in l:
        lines[i] = '        <video src="/video/bg1.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-50 mix-blend-multiply" />\n' + l
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
