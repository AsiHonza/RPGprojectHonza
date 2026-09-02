import codecs
import re

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

# fix useGameStore import
has_import = any("useGameStore" in l for l in lines)
if not has_import:
    for i, l in enumerate(lines):
        if l.startswith("import {"):
            lines.insert(i+1, "import { useGameStore } from '../store/gameStore';\n")
            break

new_lines = []
for l in lines:
    l = re.sub(r'\(q\) =>', '(q: any) =>', l)
    l = re.sub(r'\(pq\) =>', '(pq: any) =>', l)
    l = re.sub(r'\(prev\) =>', '(prev: any) =>', l)
    l = re.sub(r'\(h\) =>', '(h: any) =>', l)
    l = re.sub(r'\(currentXp\) =>', '(currentXp: any) =>', l)
    l = re.sub(r'\(l\) =>', '(l: any) =>', l)
    l = re.sub(r'\(sp\) =>', '(sp: any) =>', l)
    l = re.sub(r'\(r\) =>', '(r: any) =>', l)
    l = re.sub(r'\(inv\) =>', '(inv: any) =>', l)
    l = re.sub(r'\(enemy, idx\) =>', '(enemy: any, idx: number) =>', l)
    l = re.sub(r'\(i\) =>', '(i: any) =>', l)
    l = re.sub(r'\(p\) =>', '(p: any) =>', l)
    l = re.sub(r'\(s\) =>', '(s: any) =>', l)
    
    # Also some might not have arrow function immediately, just check the errors.
    new_lines.append(l)

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
