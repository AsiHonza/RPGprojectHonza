import codecs

lines = codecs.open('src/store/gameStore.ts', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if "worldData: any;" in l:
        lines.insert(i, "  day: number;\n  setDay: (d: number | ((d: number) => number)) => void;\n  playerLocation: {q: number, r: number} | null;\n  setPlayerLocation: (loc: {q: number, r: number} | null) => void;\n")
        break

for i, l in enumerate(lines):
    if "worldData: null," in l:
        lines.insert(i, "  day: 1,\n  setDay: (d) => set((state) => ({ day: typeof d === 'function' ? d(state.day) : d })),\n  playerLocation: null,\n  setPlayerLocation: (loc) => set({ playerLocation: loc }),\n")
        break

with codecs.open('src/store/gameStore.ts', 'w', 'utf-8') as f:
    f.write("".join(lines))
