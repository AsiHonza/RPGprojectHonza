import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

new_imports = """import { PlayerHeader } from '../features/ui/PlayerHeader';
import { PatchNotesModal } from '../features/ui/PatchNotesModal';
import { SettingsModal } from '../features/ui/SettingsModal';
import { StatsModal } from '../features/character/StatsModal';
import { SkillsModal } from '../features/character/SkillsModal';
"""

# Check missing ones
imports_to_add = []
for imp in new_imports.split('\n'):
    if not imp: continue
    mod_name = imp.split('} from')[0].split('{')[1].strip()
    if not any(mod_name in l for l in lines[:50]):
        imports_to_add.append(imp + '\n')

if imports_to_add:
    for i, l in enumerate(lines):
        if "import { NpcsModal }" in l:
            for imp in imports_to_add:
                lines.insert(i+1, imp)
            break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
