import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'narrative_text = f"[NÁHODNÉ SETKÁNÍ' in l or 'narrative_text = f"[N' in l and 'cest' in l:
        # Check if the next line is the rest of the string
        if '{resp.text.strip()}"' in lines[i+1]:
            lines[i] = lines[i].strip() + '\\n' + lines[i+1].strip() + '\n'
            lines[i+1] = ''

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
