import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if "'gemini-2.5-flash'" in l or '"gemini-2.5-flash"' in l:
        lines[i] = l.replace('gemini-2.5-flash', 'gemini-3.6-flash')
    if "'gemini-3.5-flash'" in l or '"gemini-3.5-flash"' in l:
        lines[i] = l.replace('gemini-3.5-flash', 'gemini-3.6-flash')
    
with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
