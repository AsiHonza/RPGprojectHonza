import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

has_creation = False
has_patch = False
import_idx = -1

for i, l in enumerate(lines):
    if "import { CharacterCreation }" in l:
        has_creation = True
    if "import { PATCH_NOTES }" in l:
        has_patch = True
    if "import " in l and "lucide-react" in l:
        import_idx = i

new_lines = []
for l in lines:
    if "import { CharacterCreation }" in l or "import { PATCH_NOTES }" in l:
        continue
    new_lines.append(l)

if import_idx != -1:
    new_lines.insert(import_idx+1, "import { CharacterCreation } from '../features/character/CharacterCreation';\n")
    new_lines.insert(import_idx+2, "import { PATCH_NOTES } from '../data/patchNotes';\n")

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
    
print("Imports fixed")
