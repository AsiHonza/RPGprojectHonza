import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
start = -1
end = -1

for i, l in enumerate(lines):
    if 'gameState === "creation"' in l:
        start = i
    if start != -1 and 'return (' in l and '<div className="h-[100dvh]' in lines[i+1]:
        end = i - 1
        break

if start != -1 and end != -1:
    jsx_content = "".join(lines[start:end])
    
    comp = f"""import React from 'react';
import {{ useGameStore }} from '../../store/gameStore';

export const CharacterCreation = ({{ startNewGame, loading }}: any) => {{
  const {{ 
    name, setName, 
    race, setRace, 
    dndClass, setDndClass, 
    stats, setStats, 
    keywords, setKeywords, 
    gameMode, setGameMode 
  }} = useGameStore();

  const handleStatChange = (stat: string, value: number) => {{
    setStats({{ ...stats, [stat]: value }});
  }};

  return (
{jsx_content[jsx_content.find('<div className="min-h-screen'):jsx_content.rfind('</div>')+6]}
  );
}};
"""
    with codecs.open('src/features/character/CharacterCreation.tsx', 'w', 'utf-8') as f:
        f.write(comp)
        
    # Replace in page.tsx
    new_lines = lines[:start] + ["  if (gameState === \"creation\") {\n    return <CharacterCreation startNewGame={startNewGame} loading={loading} />;\n  }\n\n"] + lines[end:]
    
    for i, l in enumerate(new_lines):
        if "import { StoryLog }" in l:
            new_lines.insert(i+1, "import { CharacterCreation } from '../features/character/CharacterCreation';\n")
            break
            
    with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
        f.write("".join(new_lines))
    print("CharacterCreation extracted")
else:
    print("Could not find boundaries")
