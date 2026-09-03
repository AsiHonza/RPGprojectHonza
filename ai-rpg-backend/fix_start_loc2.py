import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if 'initial_location = {"q": start_poi["q"], "r": start_poi["r"], "biome": start_poi.get("terrain", "Plains")}' in l:
        lines[i] = '            initial_location = {"q": start_poi["q"], "r": start_poi["r"], "biome": start_poi.get("terrain", "Plains"), "kingdom_id": start_poi.get("kingdom_id")}\n'
        break

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
