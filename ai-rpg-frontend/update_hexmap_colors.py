import codecs

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if "case 'Hills': return 'fill-[#687352]';" in l:
        lines.insert(i+1, "      case 'Wasteland': return 'fill-[#43234a]'; // Mrtvá zóna\n")
        break

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
    
print("HexMap updated")
