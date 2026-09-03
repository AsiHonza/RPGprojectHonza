import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

inside_create_character = False
for i, l in enumerate(lines):
    if 'def create_character' in l:
        inside_create_character = True
    
    if inside_create_character:
        if '"equipped": {' in l:
            lines[i] = '        "equipped": cls_data["equipped"],\n'
            lines[i+1] = ''
            lines[i+2] = ''
            lines[i+3] = ''
            break

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
