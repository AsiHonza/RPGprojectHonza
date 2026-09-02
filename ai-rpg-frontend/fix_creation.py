import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if "<CharacterCreation startNewGame=" in l:
        lines[i] = l.replace("/>", " backstory={backstory} generateBackstory={generateBackstory} />")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
    
lines2 = codecs.open('src/features/character/CharacterCreation.tsx', 'r', 'utf-8').readlines()
new_lines2 = []
for i, l in enumerate(lines2):
    if "import { useGameStore }" in l:
        new_lines2.append(l)
        new_lines2.append("import { Settings2, Sparkles } from 'lucide-react';\n")
        continue
    
    if "export const CharacterCreation = ({" in l:
        new_lines2.append("export const CharacterCreation = ({ startNewGame, loading, backstory, generateBackstory }: any) => {\n")
        new_lines2.append('  const classes = ["Barbar", "Bard", "Klerik", "Druid", "Bojovník", "Mnich", "Paladin", "Hraničář", "Tulák", "Čaroděj", "Černokněžník", "Kouzelník"];\n')
        new_lines2.append('  const races = ["Člověk", "Elf", "Trpaslík", "Půlčík", "Drakorozený", "Tiefling", "Půlork", "Gnóm"];\n')
        continue
        
    new_lines2.append(l)

with codecs.open('src/features/character/CharacterCreation.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines2))
    
print("Creation fixed")
