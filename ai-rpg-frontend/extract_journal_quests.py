import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

def extract_modal(start_pattern, comp_name, filename, props_str, state_vars, file_extra_imports, close_func):
    start = -1
    end = -1
    for i, l in enumerate(lines):
        if start_pattern in l:
            start = i
        if start != -1 and ')}' in l and '</div>' in lines[i-1] and '</div>' in lines[i-2] and '</div>' in lines[i-3]:
            end = i
            break
            
    if start == -1 or end == -1:
        print(f"Could not find {comp_name}")
        return lines

    comp = f"""import React from 'react';
{file_extra_imports}
import {{ useGameStore }} from '../../store/gameStore';

export const {comp_name} = ({{ isOpen, onClose }}: any) => {{
  const {{ {state_vars} }} = useGameStore();

  if (!isOpen) return null;

  return (
{"".join(lines[start+1:end])}
  );
}};
"""
    comp = comp.replace(close_func, 'onClose()')
    with codecs.open(f'src/features/character/{filename}', 'w', 'utf-8') as f:
        f.write(comp)
        
    new_lines = lines[:start] + [f"        <{comp_name} isOpen={{{props_str}}} onClose={{() => {close_func}}} />\n"] + lines[end+1:]
    
    # insert import
    for i, l in enumerate(new_lines):
        if "import { MapModal }" in l:
            new_lines.insert(i+1, f"import {{ {comp_name} }} from '../features/character/{filename.replace('.tsx','')}';\n")
            break
            
    print(f"{comp_name} extracted")
    return new_lines

lines = extract_modal(
    '{journalOpen && (', 
    'JournalModal', 
    'JournalModal.tsx', 
    'journalOpen', 
    'journal, name, race, dndClass', 
    "import { X, ScrollText } from 'lucide-react';", 
    "setJournalOpen(false)"
)

lines = extract_modal(
    '{questsOpen && (', 
    'QuestsModal', 
    'QuestsModal.tsx', 
    'questsOpen', 
    'quests', 
    "import { X, BookOpen } from 'lucide-react';", 
    "setQuestsOpen(false)"
)

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
