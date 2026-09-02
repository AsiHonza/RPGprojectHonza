import codecs

lines = codecs.open('src/features/character/SkillsModal.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if "export const SkillsModal" in l:
        lines[i] = "export const SkillsModal = ({ isOpen, onClose, setCustomAction }: any) => {\n"
        break

with codecs.open('src/features/character/SkillsModal.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if "<SkillsModal isOpen={skillsOpen}" in l:
        lines[i] = l.replace("/>", " setCustomAction={setCustomAction} />")
        break
        
with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
