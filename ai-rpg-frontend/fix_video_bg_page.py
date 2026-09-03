import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if '<div className="min-h-screen bg-[#e5dfc5] text-[#2d3748] flex items-center justify-center p-4 font-serif relative overflow-hidden bg-[url(\'https://www.transparenttextures.com/patterns/black-scales.png\')]">' in l:
        lines[i] = '      <div className="min-h-screen text-[#2d3748] flex items-center justify-center p-4 font-serif relative overflow-hidden bg-black">\n'
    if '<video src="/video/bg1.mp4"' in l:
        lines[i] = '        <video src="/video/bg1.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-60" />\n'

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
