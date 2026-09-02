import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if '"world_data": world_data' in l:
        lines[i] = '          "world_data": world_data,\n          "day": 1,\n          "playerLocation": {"q": math_world["pois"][0]["q"], "r": math_world["pois"][0]["r"]} if world_data else None\n'
        break

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
