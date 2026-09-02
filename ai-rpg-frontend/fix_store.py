import codecs

lines = codecs.open('src/store/gameStore.ts', 'r', 'utf-8').readlines()

new_props = """  journal: string[];
  setJournal: (journal: string[] | ((prev: string[]) => string[])) => void;
  quests: any[];
  setQuests: (quests: any[] | ((prev: any[]) => any[])) => void;
  npcs: any[];
  setNpcs: (npcs: any[] | ((prev: any[]) => any[])) => void;
"""

new_state = """  journal: [],
  setJournal: (journal) => set((state) => ({ journal: typeof journal === 'function' ? journal(state.journal) : journal })),
  quests: [],
  setQuests: (quests) => set((state) => ({ quests: typeof quests === 'function' ? quests(state.quests) : quests })),
  npcs: [],
  setNpcs: (npcs) => set((state) => ({ npcs: typeof npcs === 'function' ? npcs(state.npcs) : npcs })),
"""

for i, l in enumerate(lines):
    if "worldData: any;" in l:
        lines.insert(i+1, new_props)
        break

for i, l in enumerate(lines):
    if "worldData: null," in l:
        lines.insert(i+1, new_state)
        break

with codecs.open('src/store/gameStore.ts', 'w', 'utf-8') as f:
    f.write("".join(lines))
    
print("gameStore updated")
