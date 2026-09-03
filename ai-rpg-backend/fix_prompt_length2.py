import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'Tvým úkolem je vrátit POUZE validní JSON' in l or 'Tvm kolem je vrtit POUZE validn JSON' in l:
        lines[i] = 'Tvým úkolem je vrátit POUZE validní JSON (žádný markdown, žádné komentáře). Vygeneruj MAXIMÁLNĚ 5 nejzajímavějších lokací a 5 klíčových NPC s následující strukturou:\n'
    if '// VYGENERUJ POUZE 5' in l:
        lines[i] = ''

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
