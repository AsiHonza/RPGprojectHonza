import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
new_lines = []
skip = False
for l in lines:
    if l.strip() == '"hlava": null,' and lines[lines.index(l)-1].strip() == 'const [isOOC, setIsOOC] = useState(false);':
        skip = True
    
    if skip:
        if '});' in l:
            skip = False
        continue
        
    new_lines.append(l)
    
with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
