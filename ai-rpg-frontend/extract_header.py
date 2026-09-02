import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start = 866
end = 964

comp = f"""import React, {{ useState }} from 'react';
import {{ User, ScrollText, Volume2, VolumeX, Settings2, Menu, Map, Users, Package, MapPin, Sparkles, Heart }} from 'lucide-react';
import {{ useGameStore }} from '../../store/gameStore';

export const PlayerHeader = ({{
  setSettingsOpen,
  setPatchNotesOpen,
  setNpcsOpen,
  setInventoryOpen,
  setJournalOpen,
  setStatsOpen,
  setMapOpen,
  setQuestsOpen
}}: any) => {{
  const {{ 
    name, level, race, dndClass, hp, maxHp, xp, 
    musicPlaying, setMusicPlaying, unreadQuests,
    gold, rations, currentRegion
  }} = useGameStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
{"".join(lines[start+1:end])}
  );
}};
"""
# Replace mobileMenuOpen state references inside the component if needed. But we already declared it above.

with codecs.open('src/features/ui/PlayerHeader.tsx', 'w', 'utf-8') as f:
    f.write(comp)

props = """        setSettingsOpen={setSettingsOpen}
        setPatchNotesOpen={setPatchNotesOpen}
        setNpcsOpen={setNpcsOpen}
        setInventoryOpen={setInventoryOpen}
        setJournalOpen={setJournalOpen}
        setStatsOpen={setStatsOpen}
        setMapOpen={setMapOpen}
        setQuestsOpen={setQuestsOpen}
"""
new_lines = lines[:start] + ["      <PlayerHeader " + props.replace('\n', ' ') + "/>\n"] + lines[end+1:]

for i, l in enumerate(new_lines):
    if "import { PatchNotesModal }" in l:
        new_lines.insert(i+1, "import { PlayerHeader } from '../features/ui/PlayerHeader';\n")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
    
print("PlayerHeader extracted")
