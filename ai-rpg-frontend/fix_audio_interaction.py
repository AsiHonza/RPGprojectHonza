import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'const [actionsOpen, setActionsOpen] = useState(false);' in l:
        lines.insert(i, '  const handleGlobalClick = () => { if (musicPlaying && bgAudioRef.current && bgAudioRef.current.paused) bgAudioRef.current.play().catch(() => {}); };\n')
    if '<div className="min-h-screen bg-[#e5dfc5]' in l:
        lines[i] = l.replace('<div className="min-h-screen', '<div onClick={handleGlobalClick} className="min-h-screen')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))

# Do the same for CharacterCreation.tsx
lines2 = codecs.open('src/features/character/CharacterCreation.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines2):
    if 'return (' in l:
        lines2.insert(i, '    const handleGlobalClick = () => { const audio = document.getElementById("bg-audio") as HTMLAudioElement; if (audio && audio.paused) audio.play().catch(() => {}); };\n')
    if '<div className="min-h-screen bg-[#e5dfc5]' in l:
        lines2[i] = l.replace('<div className="min-h-screen', '<div onClick={handleGlobalClick} className="min-h-screen')

with codecs.open('src/features/character/CharacterCreation.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines2))
