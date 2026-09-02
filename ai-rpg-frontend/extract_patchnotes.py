import codecs
import re

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start = 860
end = 892

comp = f"""import React from 'react';
import {{ X, ScrollText }} from 'lucide-react';
import {{ PATCH_NOTES }} from '../../data/patchNotes';

export const PatchNotesModal = ({{ isOpen, onClose }}: any) => {{
  if (!isOpen) return null;

  return (
{"".join(lines[start+1:end])}
  );
}};
"""
comp = comp.replace('setPatchNotesOpen(false)', 'onClose()')

with codecs.open('src/features/ui/PatchNotesModal.tsx', 'w', 'utf-8') as f:
    f.write(comp)
    
new_lines = lines[:start] + ["      <PatchNotesModal isOpen={patchNotesOpen} onClose={() => setPatchNotesOpen(false)} />\n"] + lines[end+1:]

for i, l in enumerate(new_lines):
    if "import { SettingsModal }" in l:
        new_lines.insert(i+1, "import { PatchNotesModal } from '../features/ui/PatchNotesModal';\n")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
    
print("PatchNotesModal extracted")
