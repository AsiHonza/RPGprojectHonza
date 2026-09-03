import codecs

lines = codecs.open('ai-rpg-backend/main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '"hexes": math_world["hexes"],' in l:
        lines[i] = l.replace('"hexes": math_world["hexes"],', '"hexes": math_world.get("hex_grid", []),')
        break

with codecs.open('ai-rpg-backend/main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
