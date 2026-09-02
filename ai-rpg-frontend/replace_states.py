import codecs
import re

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

# Collect store properties
store_props = [
    "gameState", "loading", "name", "dndClass", "race", "stats", "keywords", "gameMode", "backstory",
    "hp", "level", "xp", "gold", "rations", "skillPoints", "inventory", "equipped", "worldData",
    "currentRegion", "locationType", "currentSpellSlots", "maxSpellSlots", "skills", "availableSkills",
    "inCombat", "enemies"
]

out_lines = []
imported = False

for i, l in enumerate(lines):
    if "import { useState" in l and not imported:
        out_lines.append(l)
        out_lines.append("import { useGameStore } from '../store/gameStore';\n")
        imported = True
        continue
        
    if "useState" in l and "const [" in l and "]" in l:
        match = re.search(r'const\s+\[([a-zA-Z0-9_]+),\s*set([a-zA-Z0-9_]+)\]', l)
        if match:
            var_name = match.group(1)
            if var_name in store_props:
                # Omit this line, it's moved to store
                continue

    out_lines.append(l)

# Insert destructuring right after `export default function Home() {`
for i, l in enumerate(out_lines):
    if "export default function Home() {" in l:
        destruct = "  const { " + ", ".join([f"{p}, set{p[0].upper()+p[1:]}" for p in store_props]) + " } = useGameStore();\n"
        out_lines.insert(i + 1, destruct)
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(out_lines))
    
print("States replaced")
