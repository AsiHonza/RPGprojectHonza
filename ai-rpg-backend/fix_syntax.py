import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

new_lines = []
skip_next = False
for i, l in enumerate(lines):
    if skip_next:
        skip_next = False
        continue
    
    if 'narrative_text = f"[NHODN SETKN na cest]' in l or 'narrative_text = f"[NÁHODNÉ SETKÁNÍ na cestě]' in l:
        # replace with single line
        new_lines.append('        narrative_text = f"[NÁHODNÉ SETKÁNÍ na cestě]\\n{resp.text.strip()}"\n')
        skip_next = True
    else:
        new_lines.append(l)

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
