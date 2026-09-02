import codecs

lines = codecs.open('src/features/ui/PlayerHeader.tsx', 'r', 'utf-8').readlines()

new_destruct = "  const { name, level, race, dndClass, hp, xp, musicPlaying, setMusicPlaying, unreadQuests, setUnreadQuests, gold, rations, currentRegion, skillPoints, quests, worldData } = useGameStore();\n"

for i, l in enumerate(lines):
    if "const { " in l:
        start = i
        break
        
for j in range(start, len(lines)):
    if "} = useGameStore();" in lines[j]:
        end = j
        break

new_lines = lines[:start] + [new_destruct] + lines[end+1:]

with codecs.open('src/features/ui/PlayerHeader.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
