import codecs
import re

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

# fix useGameStore import
has_import = any("useGameStore" in l for l in lines)
if not has_import:
    for i, l in enumerate(lines):
        if "import React" in l:
            lines.insert(i+1, "import { useGameStore } from '../store/gameStore';\n")
            break

new_lines = []
for i, l in enumerate(lines):
    # Fix implicitly any types from the output
    l = l.replace('(q)', '(q: any)')
    l = l.replace('(pq)', '(pq: any)')
    l = l.replace('(prev)', '(prev: any)')
    l = l.replace('(h)', '(h: any)')
    l = l.replace('(currentXp)', '(currentXp: any)')
    l = l.replace('(l)', '(l: any)')
    l = l.replace('(sp)', '(sp: any)')
    l = l.replace('(r)', '(r: any)')
    l = l.replace('(inv)', '(inv: any)')
    l = l.replace('(enemy, idx)', '(enemy: any, idx: number)')
    l = l.replace('(i, idx)', '(i: any, idx: number)')
    l = l.replace('(i)', '(i: any)')
    l = l.replace('(p)', '(p: any)')
    l = l.replace('(s)', '(s: any)')
    new_lines.append(l)

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
