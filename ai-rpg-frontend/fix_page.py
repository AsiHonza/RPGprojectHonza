import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

# 1. Fix import
import_found = False
for l in lines:
    if "import HexMap" in l:
        import_found = True
        break
        
if not import_found:
    for i, l in enumerate(lines):
        if "import" in l:
            lines.insert(i, 'import HexMap from "../components/map/HexMap";\n')
            break

# 2. Fix hex type
for i, l in enumerate(lines):
    if "onHexClick={(hex) => {" in l:
        lines[i] = l.replace("onHexClick={(hex) => {", "onHexClick={(hex: any) => {")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
    
print("Page fixed")
