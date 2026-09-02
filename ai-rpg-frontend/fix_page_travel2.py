import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if "const { bgVolume" in l and "useGameStore();" in l:
        lines[i] = l.replace("useGameStore();", " setPlayerLocation, setDay } = useGameStore();\n")
        break

for i, l in enumerate(lines):
    if "playVoice(data.narrative, " in l:
        lines[i] = lines[i].replace("playVoice(", "playAudio(")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
