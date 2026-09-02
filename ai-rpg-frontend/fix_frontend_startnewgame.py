import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Replace startNewGame logic
content = re.sub(
    r'setSuggestedActions\(\["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"\]\);\s*setHp\(100\);\s*setCurrentLocationDesc\(data\.popis_okoli \|\| "Neznámé místo\."\);\s*setCurrentRegion\("Začátek cesty"\);\s*const startInv = \[\s*\{.*?\}\s*\];\s*setInventory\(startInv\);\s*setEquipped\(\{.*?\}\);',
    'setSuggestedActions(["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"]);\n        setCurrentLocationDesc(data.popis_okoli || "Neznámé místo.");\n        setCurrentRegion("Začátek cesty");\n        \n        const state = data.state || {};\n        setHp(state.hp || 100);\n        setXp(state.xp || 0);\n        setLevel(state.level || 1);\n        setSkillPoints(state.skillPoints || 0);\n        setInventory(state.inventory || []);\n        setEquipped(state.equipped || {});\n        setSkills(state.skills || []);\n        setAvailableSkills(state.available_skills || []);\n        setJournal(state.journal || []);',
    content,
    flags=re.DOTALL
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("startNewGame replace done.")
