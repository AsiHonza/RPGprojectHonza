import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start_idx = -1
end_idx = -1

for i, l in enumerate(lines):
    if "inventoryOpen && (" in l:
        start_idx = i
    # we know from earlier it ends around 1946 with }
    if start_idx != -1 and i > start_idx + 150 and "}" in l and "{" not in l and "}" in lines[i-1] and "</div>" in lines[i-2]:
        end_idx = i
        break

# Actually we know it was 1773 to 1945 from the previous extraction
# let's just do it directly via indices if they match
if lines[1773].find("inventoryOpen && (") != -1:
    start_idx = 1773
    end_idx = 1945
else:
    for i, l in enumerate(lines):
        if "inventoryOpen && (" in l:
            start_idx = i
            break
    for i in range(start_idx, len(lines)):
        if "questBanner && (" in lines[i] or "audio ref=" in lines[i]:
            end_idx = i - 1
            break

print(f"Replacing {start_idx} to {end_idx}")

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx] + ["      <InventoryPanel \n        isOpen={inventoryOpen} \n        onClose={() => setInventoryOpen(false)} \n        selectedItem={selectedItem} \n        setSelectedItem={setSelectedItem} \n      />\n"] + lines[end_idx+1:]
    
    # insert import
    for i, l in enumerate(new_lines):
        if "import { ItemIcon }" in l:
            new_lines.insert(i+1, "import { InventoryPanel } from '../features/character/InventoryPanel';\n")
            break
            
    with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
        f.write("".join(new_lines))
    print("page.tsx updated")
