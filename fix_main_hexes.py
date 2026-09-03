import codecs

lines = codecs.open('ai-rpg-backend/main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '"hexes": math_world.get("hex_grid", []),' in l:
        lines[i] = l.replace('"hexes":', '"hex_grid":')
    if 'center_hex = next((h for h in world_data["hexes"] if h["q"] == 0 and h["r"] == 0), world_data["hexes"][0])' in l:
        lines[i] = l.replace('world_data["hexes"]', 'world_data["hex_grid"]')
    if 'if world_data and world_data.get("hexes"):' in l:
        lines[i] = l.replace('world_data.get("hexes")', 'world_data.get("hex_grid")')

with codecs.open('ai-rpg-backend/main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
