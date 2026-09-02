import codecs
import re

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start = 1185
end = 1239

comp = f"""import React from 'react';
import {{ X, User }} from 'lucide-react';
import {{ useGameStore }} from '../../store/gameStore';

export const StatsModal = ({{ isOpen, onClose }}: any) => {{
  const {{ stats, setStats, skillPoints, setSkillPoints }} = useGameStore();

  if (!isOpen) return null;

  return (
{"".join(lines[start+1:end])}
  );
}};
"""
comp = comp.replace('setStatsOpen(false)', 'onClose()')
comp = comp.replace('setSkillPoints(p => p - 1)', 'setSkillPoints((p: any) => p - 1)')

with codecs.open('src/features/character/StatsModal.tsx', 'w', 'utf-8') as f:
    f.write(comp)
    
new_lines = lines[:start] + ["      <StatsModal isOpen={statsOpen} onClose={() => setStatsOpen(false)} />\n"] + lines[end+1:]

for i, l in enumerate(new_lines):
    if "import { PlayerHeader }" in l:
        new_lines.insert(i+1, "import { StatsModal } from '../features/character/StatsModal';\n")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
    
print("StatsModal extracted")
