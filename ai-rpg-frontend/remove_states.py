import codecs
import re

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
new_lines = []

for l in lines:
    if "const [journal, setJournal] = useState" in l:
        continue
    if "const [quests, setQuests] = useState" in l:
        continue
    if "const [npcs, setNpcs] = useState" in l:
        continue
    # Wait, page.tsx needs to access them? 
    # Yes, page.tsx needs journal, quests, npcs for the backend updates!
    new_lines.append(l)

for i, l in enumerate(new_lines):
    if "const { " in l and "useGameStore();" in l:
        # append them to the destructuring
        new_lines[i] = l.replace("const { ", "const { journal, setJournal, quests, setQuests, npcs, setNpcs, ")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
    
print("Removed old states from page.tsx")
