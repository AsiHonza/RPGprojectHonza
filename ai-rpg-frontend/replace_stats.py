import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
start = -1
end = -1

for i, l in enumerate(lines):
    if "key: 'str'" in l and "label:" in l:
        start = i - 2
        break

if start != -1:
    for i in range(start, start + 30):
        if "))}" in lines[i]:
            end = i + 1
            break

print(f"{start} to {end}")

if start != -1 and end != -1:
    new_lines = lines[:start] + ["              <CharacterStatsPanel />\n"] + lines[end+1:]
    
    for i, l in enumerate(new_lines):
        if "import { InventoryPanel }" in l:
            new_lines.insert(i+1, "import { CharacterStatsPanel } from '../features/character/CharacterStatsPanel';\n")
            break
            
    with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
        f.write("".join(new_lines))
    print("Stats panel replaced")
