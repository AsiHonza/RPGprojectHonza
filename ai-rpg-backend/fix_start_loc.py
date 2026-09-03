import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()
start = -1
for i, l in enumerate(lines):
    if 'initial_location = None' in l:
        start = i
        break

if start != -1:
    lines[start:start+7] = [
        '    initial_location = None\n',
        '    if world_data and world_data.get("pois"):\n',
        '        import random\n',
        '        capitals = [p for p in world_data["pois"] if p.get("type") == "Capital"]\n',
        '        if capitals:\n',
        '            start_poi = random.choice(capitals)\n',
        '            initial_location = {"q": start_poi["q"], "r": start_poi["r"], "biome": start_poi.get("terrain", "Plains")}\n',
        '        else:\n',
        '            center_hex = world_data.get("hex_grid", [{}])[0]\n',
        '            initial_location = {"q": center_hex.get("q",0), "r": center_hex.get("r",0), "biome": center_hex.get("terrain", "Plains")}\n'
    ]

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
