import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '"biome": center_hex["biome"]' in l:
        lines[i] = l.replace('"biome": center_hex["biome"]', '"biome": center_hex.get("terrain", "Plains")')

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
