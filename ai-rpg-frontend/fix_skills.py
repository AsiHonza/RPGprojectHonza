import codecs

lines = codecs.open('src/features/character/SkillsModal.tsx', 'r', 'utf-8').readlines()

# find {skillsOpen && (
for i, l in enumerate(lines):
    if '{skillsOpen && (' in l:
        lines[i] = ""
        break
        
# find the last )}
for i in range(len(lines)-1, -1, -1):
    if ')}' in lines[i]:
        lines[i] = lines[i].replace(')}', '')
        break

with codecs.open('src/features/character/SkillsModal.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
