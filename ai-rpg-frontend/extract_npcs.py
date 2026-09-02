import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
start = 1597
end = 1637

comp = f"""import React from 'react';
import {{ X, Users, Map, MapPin }} from 'lucide-react';
import {{ useGameStore }} from '../../store/gameStore';

export const NpcsModal = ({{ isOpen, onClose, setMapOpen }}: any) => {{
  const {{ npcs, worldData }} = useGameStore();

  if (!isOpen) return null;

  return (
{"".join(lines[start+1:end])}
  );
}};
"""

comp = comp.replace('setNpcsOpen(false)', 'onClose()')

with codecs.open('src/features/character/NpcsModal.tsx', 'w', 'utf-8') as f:
    f.write(comp)
    
new_lines = lines[:start] + ["        <NpcsModal isOpen={npcsOpen} onClose={() => setNpcsOpen(false)} setMapOpen={setMapOpen} />\n"] + lines[end+1:]

for i, l in enumerate(new_lines):
    if "import { MapModal }" in l:
        new_lines.insert(i+1, "import { NpcsModal } from '../features/character/NpcsModal';\n")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
    
print("NpcsModal extracted")
