import codecs
import re

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

new_lines = []
for l in lines:
    l = re.sub(r'setRations\(\(r: any\) => Math.max\(0, r - 1\)\)', 'setRations(Math.max(0, rations - 1))', l)
    l = re.sub(r'setHp\(\(h: any\) => h - amount\)', 'setHp(hp - amount)', l)
    l = re.sub(r'setHp\(\(h: any\) => Math.max\(0, h - (.*?)\)\)', r'setHp(Math.max(0, hp - \1))', l)
    l = re.sub(r'setHp\(\(h: any\) => Math.min\(100, h \+ (.*?)\)\)', r'setHp(Math.min(100, hp + \1))', l)
    l = re.sub(r'setHp\(\(p: any\) => Math.min\(100, p \+ (.*?)\)\)', r'setHp(Math.min(100, hp + \1))', l)
    l = re.sub(r'setXp\(\(currentXp: any\) => currentXp \+ (.*?)\)', r'setXp(xp + \1)', l)
    l = re.sub(r'setLevel\(\(l: any\) => l \+ 1\)', 'setLevel(level + 1)', l)
    l = re.sub(r'setSkillPoints\(\(sp: any\) => sp \+ 1\)', 'setSkillPoints(skillPoints + 1)', l)
    l = re.sub(r'setInventory\(\(inv: any\) => \[...inv, (.*?)\]\)', r'setInventory([...inventory, \1])', l)
    # setJournal is fine, I added function support in gameStore.ts
    new_lines.append(l)

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
