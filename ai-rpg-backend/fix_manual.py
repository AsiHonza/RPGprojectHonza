import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '"inventory": cls_data["starting_equipment"]' in l:
        lines[i] = l.replace('"inventory": cls_data["starting_equipment"]', '"inventory": cls_data["inventory"]')
    elif '"skills": cls_data["skills"]' in l:
        lines[i] = l.replace('"skills": cls_data["skills"]', '"skills": cls_data["starting_skills"]')
    elif '"hlavní ruka": cls_data["starting_equipment"]' in l:
        lines[i] = '            "hlavní ruka": cls_data["equipped"]["hlavní ruka"],\n'
    elif '"zbroj": cls_data["starting_equipment"]' in l:
        lines[i] = '            "hruď": cls_data["equipped"]["hruď"]\n'
    # Also I need to add other equipped slots for completeness:
    # but the simplest is just to replace the whole equipped block, but SAFELY.

# Actually let's just do it manually with a string replace on the state dict
content = "".join(lines)
content = content.replace(
'''        "equipped": {
            "hlavní ruka": cls_data["starting_equipment"][0]["id"] if cls_data["starting_equipment"] else None,
            "zbroj": cls_data["starting_equipment"][1]["id"] if len(cls_data["starting_equipment"]) > 1 else None
        },''',
'''        "equipped": cls_data["equipped"],'''
)

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write(content)
