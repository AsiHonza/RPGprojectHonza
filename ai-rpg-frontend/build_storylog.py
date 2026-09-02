import codecs

with codecs.open('storylog_extracted.tsx', 'r', 'utf-8') as f:
    jsx = f.read()

comp = f"""import React from 'react';
import {{ Volume2 }} from 'lucide-react';
import {{ useGameStore }} from '../../store/gameStore';
import {{ TypewriterText }} from '../../components/ui/TypewriterText';
import {{ FormattedSystemLog }} from '../../components/ui/FormattedSystemLog';

export const StoryLog = ({{ history, playAudio }}: {{ history: any[], playAudio: (text: string, type: string) => void }}) => {{
  const {{ name, race, dndClass }} = useGameStore();

  return (
    <>
      {jsx}
    </>
  );
}};
"""

with codecs.open('src/features/character/StoryLog.tsx', 'w', 'utf-8') as f:
    f.write(comp)
    
print("StoryLog.tsx created")
