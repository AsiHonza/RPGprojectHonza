import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'world_data = {' in l:
        lines[i+1] = '                "hex_grid": math_world["hex_grid"],\n'
        lines[i+2] = '                "hex_radius": math_world["hex_radius"],\n'
        lines[i+3] = '                "kingdoms": ai_data.get("kingdoms", []),\n'
        lines[i+4] = '                "locations": ai_data.get("locations", []),\n'
        lines[i+5] = '                "main_plot": ai_data.get("main_plot", "")\n'
        lines[i+6] = '            }\n'
        break

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
