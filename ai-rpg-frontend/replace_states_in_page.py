import codecs
import re

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

# All states in gameStore
store_states = [
    "gameState", "loading", "name", "dndClass", "race", "stats", "keywords", "gameMode", "backstory",
    "hp", "level", "xp", "gold", "rations", "skillPoints", "inventory", "equipped", "worldData",
    "journal", "quests", "npcs", "currentRegion", "locationType", "currentSpellSlots", "maxSpellSlots",
    "skills", "availableSkills", "inCombat", "enemies"
]

def capitalize(s):
    return s[:1].upper() + s[1:]

to_destructure = []
for state in store_states:
    to_destructure.append(state)
    to_destructure.append("set" + capitalize(state))

destructure_str = "  const { " + ", ".join(to_destructure) + " } = useGameStore();\n"

new_lines = []

for l in lines:
    is_store_state = False
    for state in store_states:
        if f"const [{state}, set{capitalize(state)}] = useState" in l:
            is_store_state = True
            break
    if not is_store_state:
        new_lines.append(l)

# Inject destructure at start of Home()
for i, l in enumerate(new_lines):
    if "export default function Home()" in l:
        new_lines.insert(i+1, destructure_str)
        break
        
# Check if useGameStore import exists
has_import = any("useGameStore" in l for l in new_lines)
if not has_import:
    for i, l in enumerate(new_lines):
        if l.startswith("import {"):
            new_lines.insert(i+1, "import { useGameStore } from '../store/gameStore';\n")
            break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
    
print("States replaced in page.tsx")
