import codecs

lines = codecs.open('src/features/character/InventoryPanel.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if "const { inventory, equipped, setEquipped, gold } = useGameStore();" in l:
        lines[i] = "  const { inventory, equipped, setEquipped, gold, hp, stats } = useGameStore();\n"
        break

with codecs.open('src/features/character/InventoryPanel.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
    
print("InventoryPanel fixed")
