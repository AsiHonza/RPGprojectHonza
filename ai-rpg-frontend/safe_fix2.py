import codecs
import re

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

new_lines = []
has_import = False
for l in lines:
    if "import { useGameStore }" in l:
        has_import = True
        
for l in lines:
    if l.startswith("import {") and not has_import:
        new_lines.append("import { useGameStore } from '../store/gameStore';\n")
        has_import = True
    
    # Fix implicit any by replacing the exact patterns in the errors
    # (q => (q: any
    l = l.replace('q =>', '(q: any) =>')
    l = l.replace('pq =>', '(pq: any) =>')
    l = l.replace('prev =>', '(prev: any) =>')
    l = l.replace('h =>', '(h: any) =>')
    l = l.replace('currentXp =>', '(currentXp: any) =>')
    l = l.replace('l =>', '(l: any) =>')
    l = l.replace('sp =>', '(sp: any) =>')
    l = l.replace('r =>', '(r: any) =>')
    l = l.replace('inv =>', '(inv: any) =>')
    l = l.replace('i =>', '(i: any) =>')
    l = l.replace('p =>', '(p: any) =>')
    l = l.replace('s =>', '(s: any) =>')
    new_lines.append(l)

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
