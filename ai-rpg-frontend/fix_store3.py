import codecs
import re

lines = codecs.open('src/store/gameStore.ts', 'r', 'utf-8').readlines()

new_lines = []
for l in lines:
    l = re.sub(r'setCurrentSpellSlots: \(s: number\) => void;', 'setCurrentSpellSlots: (s: number | ((s: number) => number)) => void;', l)
    l = re.sub(r'setCurrentSpellSlots: \(currentSpellSlots\) => set\(\{ currentSpellSlots \}\),', 'setCurrentSpellSlots: (currentSpellSlots) => set((state) => ({ currentSpellSlots: typeof currentSpellSlots === "function" ? currentSpellSlots(state.currentSpellSlots) : currentSpellSlots })),', l)
    new_lines.append(l)

with codecs.open('src/store/gameStore.ts', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
