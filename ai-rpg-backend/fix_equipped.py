import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

new_lines = []
skip = False
for l in lines:
    if skip:
        if '},' in l:
            skip = False
            new_lines.append('        "equipped": cls_data["equipped"],\n')
        continue
    if '"equipped": {' in l:
        skip = True
        continue
    new_lines.append(l)

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
