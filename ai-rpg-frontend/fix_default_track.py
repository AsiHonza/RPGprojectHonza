import codecs

lines = codecs.open('src/store/gameStore.ts', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if "currentTrack: '/ambient.mp3'," in l:
        lines[i] = "  currentTrack: '/music/theme.mp3',\n"
        break

with codecs.open('src/store/gameStore.ts', 'w', 'utf-8') as f:
    f.write("".join(lines))
