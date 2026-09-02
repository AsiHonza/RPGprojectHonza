import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
has_import = any("SkillsModal" in l for l in lines[:100])
if not has_import:
    for i, l in enumerate(lines):
        if "import { StatsModal" in l:
            lines.insert(i+1, "import { SkillsModal } from '../features/character/SkillsModal';\n")
            break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
