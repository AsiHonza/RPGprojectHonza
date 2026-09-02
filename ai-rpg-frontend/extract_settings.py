import codecs
import re

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start = -1
end = -1
for i, l in enumerate(lines):
    if '{settingsOpen && (' in l:
        start = i
    if start != -1 and ')}' in l and i > start:
        if '</div>' in lines[i-1] and '</div>' in lines[i-2] and '</div>' in lines[i-3]:
            end = i
            break

comp = f"""import React from 'react';
import {{ X, Settings2, Mail }} from 'lucide-react';
import {{ useGameStore }} from '../../store/gameStore';

export const SettingsModal = ({{ isOpen, onClose }}: any) => {{
  const {{ bgVolume, setBgVolume, ttsVolume, setTtsVolume }} = useGameStore();

  if (!isOpen) return null;

  return (
{"".join(lines[start+1:end])}
  );
}};
"""
comp = comp.replace('setSettingsOpen(false)', 'onClose()')

with codecs.open('src/features/ui/SettingsModal.tsx', 'w', 'utf-8') as f:
    f.write(comp)
    
new_lines = lines[:start] + ["      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />\n"] + lines[end+1:]

for i, l in enumerate(new_lines):
    if "import { JournalModal }" in l:
        new_lines.insert(i+1, "import { SettingsModal } from '../features/ui/SettingsModal';\n")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
    
print("SettingsModal extracted")
