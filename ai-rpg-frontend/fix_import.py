import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if "import ReactPlayer" in l:
        lines.insert(i, "import { ItemIcon } from '../components/ui/ItemIcon';\n")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
    
print("Import fixed")
