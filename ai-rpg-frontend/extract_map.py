import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
start = 1593
end = 1622

comp = f"""import React from 'react';
import {{ X }} from 'lucide-react';
import {{ HexMap }} from '../../components/map/HexMap';
import {{ useGameStore }} from '../../store/gameStore';

export const MapModal = ({{ isOpen, onClose, setSelectedItem }}: any) => {{
  const {{ worldData }} = useGameStore();

  if (!isOpen || !worldData) return null;

  return (
{"".join(lines[start+1:end])}
  );
}};
"""

# Replace setMapOpen(false) with onClose()
comp = comp.replace('setMapOpen(false)', 'onClose()')

with codecs.open('src/features/map/MapModal.tsx', 'w', 'utf-8') as f:
    f.write(comp)
    
# Update page.tsx
new_lines = lines[:start] + ["        <MapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} setSelectedItem={setSelectedItem} />\n"] + lines[end+1:]

# Add import
for i, l in enumerate(new_lines):
    if "import { CharacterCreation }" in l:
        new_lines.insert(i+1, "import { MapModal } from '../features/map/MapModal';\n")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
    
print("MapModal extracted")
