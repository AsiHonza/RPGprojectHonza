import codecs

lines = codecs.open('src/store/gameStore.ts', 'r', 'utf-8').readlines()

new_props = """  unreadQuests: boolean;
  setUnreadQuests: (u: boolean | ((u: boolean) => boolean)) => void;
"""
new_state = """  unreadQuests: false,
  setUnreadQuests: (unreadQuests) => set((state) => ({ unreadQuests: typeof unreadQuests === "function" ? unreadQuests(state.unreadQuests) : unreadQuests })),
"""

for i, l in enumerate(lines):
    if "musicPlaying: boolean;" in l:
        lines.insert(i+1, new_props)
        break

for i, l in enumerate(lines):
    if "musicPlaying: true," in l:
        lines.insert(i+1, new_state)
        break

with codecs.open('src/store/gameStore.ts', 'w', 'utf-8') as f:
    f.write("".join(lines))
