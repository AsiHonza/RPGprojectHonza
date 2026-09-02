import codecs
import re

lines = codecs.open('src/store/gameStore.ts', 'r', 'utf-8').readlines()

new_lines = []
for l in lines:
    l = re.sub(r'setHp: \(hp: number\) => void;', 'setHp: (hp: number | ((h: number) => number)) => void;', l)
    l = re.sub(r'setLevel: \(l: number\) => void;', 'setLevel: (l: number | ((l: number) => number)) => void;', l)
    l = re.sub(r'setXp: \(x: number\) => void;', 'setXp: (x: number | ((x: number) => number)) => void;', l)
    l = re.sub(r'setRations: \(r: number\) => void;', 'setRations: (r: number | ((r: number) => number)) => void;', l)
    l = re.sub(r'setSkillPoints: \(s: number\) => void;', 'setSkillPoints: (s: number | ((s: number) => number)) => void;', l)
    l = re.sub(r'setInventory: \(inv: any\[\]\) => void;', 'setInventory: (inv: any[] | ((inv: any[]) => any[])) => void;', l)
    l = re.sub(r'setUnreadQuests: \(u: boolean\) => void;', 'setUnreadQuests: (u: boolean | ((u: boolean) => boolean)) => void;', l)
    
    # implementations
    l = re.sub(r'setHp: \(hp\) => set\(\{ hp \}\),', 'setHp: (hp) => set((state) => ({ hp: typeof hp === "function" ? hp(state.hp) : hp })),', l)
    l = re.sub(r'setLevel: \(level\) => set\(\{ level \}\),', 'setLevel: (level) => set((state) => ({ level: typeof level === "function" ? level(state.level) : level })),', l)
    l = re.sub(r'setXp: \(xp\) => set\(\{ xp \}\),', 'setXp: (xp) => set((state) => ({ xp: typeof xp === "function" ? xp(state.xp) : xp })),', l)
    l = re.sub(r'setRations: \(rations\) => set\(\{ rations \}\),', 'setRations: (rations) => set((state) => ({ rations: typeof rations === "function" ? rations(state.rations) : rations })),', l)
    l = re.sub(r'setSkillPoints: \(skillPoints\) => set\(\{ skillPoints \}\),', 'setSkillPoints: (skillPoints) => set((state) => ({ skillPoints: typeof skillPoints === "function" ? skillPoints(state.skillPoints) : skillPoints })),', l)
    l = re.sub(r'setInventory: \(inventory\) => set\(\{ inventory \}\),', 'setInventory: (inventory) => set((state) => ({ inventory: typeof inventory === "function" ? inventory(state.inventory) : inventory })),', l)
    l = re.sub(r'setUnreadQuests: \(unreadQuests\) => set\(\{ unreadQuests \}\),', 'setUnreadQuests: (unreadQuests) => set((state) => ({ unreadQuests: typeof unreadQuests === "function" ? unreadQuests(state.unreadQuests) : unreadQuests })),', l)
    
    new_lines.append(l)

with codecs.open('src/store/gameStore.ts', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
