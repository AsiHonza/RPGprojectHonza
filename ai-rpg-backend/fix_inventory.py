import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

inside_create_character = False
for i, l in enumerate(lines):
    if 'def create_character' in l:
        inside_create_character = True
    
    if inside_create_character:
        if '"inventory": cls_data["starting_equipment"]' in l:
            lines[i] = l.replace('"inventory": cls_data["starting_equipment"]', '"inventory": cls_data["inventory"]')
        elif '"skills": cls_data["skills"]' in l:
            lines[i] = l.replace('"skills": cls_data["skills"]', '"skills": cls_data["starting_skills"]')

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
