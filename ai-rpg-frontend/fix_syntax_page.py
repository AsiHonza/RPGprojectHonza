import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if "} =  setPlayerLocation, setDay } = useGameStore();" in l:
        lines[i] = l.replace("} =  setPlayerLocation, setDay } = useGameStore();", ", setPlayerLocation, setDay } = useGameStore();")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
