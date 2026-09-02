import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
start = -1
end = -1

for i, l in enumerate(lines):
    if "const getStringHash = (str: string) => {" in l:
        start = i
    if "const TypewriterText =" in l:
        end = i
        break

if start != -1 and end != -1:
    del lines[start:end]
    
    # Pridat import ItemIcon
    for i, l in enumerate(lines):
        if "import ReactPlayer" in l:
            lines.insert(i, "import { ItemIcon } from '../components/ui/ItemIcon';\n")
            break
            
    with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
        f.write("".join(lines))
    print("ItemIcon removed cleanly")
else:
    print(start, end)
