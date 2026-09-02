import codecs
import re

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start = 1391
end = 1494
# wait, the start of skillsOpen was 1391? No, 1193 in the past? Let's check where skillsOpen is now!
for i, l in enumerate(lines):
    if '{skillsOpen && (' in l:
        start = i
        break
        
for i in range(start+1, len(lines)):
    if l.strip() == ')}' and '</div>' in lines[i-1] and '</div>' in lines[i-2]:
        end = i
        break

comp = f"""import React from 'react';
import {{ X, Sparkles, BookOpen, Shield, Sword, FlaskConical, Gem }} from 'lucide-react';
import {{ useGameStore }} from '../../store/gameStore';

export const SkillsModal = ({{ isOpen, onClose }}: any) => {{
  const {{ 
    dndClass, level, skills, setSkills, availableSkills, setAvailableSkills, 
    setCurrentSpellSlots, maxSpellSlots, skillPoints, setSkillPoints 
  }} = useGameStore();

  if (!isOpen) return null;

  return (
{"".join(lines[start+1:end+1])}
  );
}};
"""
comp = comp.replace('setSkillsOpen(false)', 'onClose()')
comp = comp.replace('setSkillPoints(p => p - 1)', 'setSkillPoints((p: any) => p - 1)')

with codecs.open('src/features/character/SkillsModal.tsx', 'w', 'utf-8') as f:
    f.write(comp)
    
new_lines = lines[:start] + ["      <SkillsModal isOpen={skillsOpen} onClose={() => setSkillsOpen(false)} />\n"] + lines[end+1:]

for i, l in enumerate(new_lines):
    if "import { StatsModal }" in l:
        new_lines.insert(i+1, "import { SkillsModal } from '../features/character/SkillsModal';\n")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
    
print("SkillsModal extracted")
