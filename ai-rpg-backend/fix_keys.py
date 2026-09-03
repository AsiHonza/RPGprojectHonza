import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '"inventory": cls_data["starting_equipment"]' in l:
        lines[i] = l.replace('"inventory": cls_data["starting_equipment"]', '"inventory": cls_data["inventory"]')
    elif '"skills": cls_data["skills"]' in l:
        lines[i] = l.replace('"skills": cls_data["skills"]', '"skills": cls_data["starting_skills"]')
    elif '"hlavn ruka": cls_data["starting_equipment"][0]["id"] if cls_data["starting_equipment"] else None,' in l or '"hlavní ruka":' in l or '"hlavn\xed ruka": cls_data["starting_equipment"]' in l:
        # Just replace the whole equipped block because cls_data already has "equipped"
        pass

# Let's write a robust replace for the equipped block
content = "".join(lines)
import re
content = re.sub(
    r'"equipped": \{[\s\S]*?\},',
    r'"equipped": cls_data["equipped"],',
    content
)

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write(content)
