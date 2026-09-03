import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()
new_lines = []
for l in lines:
    if 'narrative_text = f"[NHODN SETKN na cest]' in l or 'narrative_text = f"[NÁHODNÉ SETKÁNÍ' in l:
        pass # Skip
    elif '{resp.text.strip()}"' in l and 'else:' not in l:
        new_lines.append('        narrative_text = f"[NÁHODNÉ SETKÁNÍ na cestě]\\n{resp.text.strip()}"\n')
    elif 'history.append({"role": "user"' in l:
        new_lines.append('    history.append({"role": "user", "content": f"[CESTOVÁNÍ] Přesun na hex ({req.target_q}, {req.target_r})"}) \n')
    else:
        new_lines.append(l)

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
