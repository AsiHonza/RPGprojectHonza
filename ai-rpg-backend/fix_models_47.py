import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if "'gemini-3.6-flash'" in l or '"gemini-3.6-flash"' in l:
        lines[i] = l.replace('gemini-3.6-flash', 'gemini-4.7-flash')
    
with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
