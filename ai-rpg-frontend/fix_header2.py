import codecs
import re

lines = codecs.open('src/features/ui/PlayerHeader.tsx', 'r', 'utf-8').readlines()

new_lines = []
for l in lines:
    if "import { User," in l:
        l = l.replace("import { User,", "import { User, Drumstick, BookOpen,")
    if "setStatsOpen," in l:
        l = l + "  setSkillsOpen,\n"
    if "const { " in l and "name, level" in l:
        l = "  const { name, level, race, dndClass, hp, xp, musicPlaying, setMusicPlaying, unreadQuests, setUnreadQuests, gold, rations, currentRegion, skillPoints, quests, worldData } = useGameStore();\n"
    new_lines.append(l)

with codecs.open('src/features/ui/PlayerHeader.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
