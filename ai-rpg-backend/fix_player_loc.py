import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if '"player_location": initial_location,' in l:
        lines[i] = '        "playerLocation": initial_location,\n'
        break

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
