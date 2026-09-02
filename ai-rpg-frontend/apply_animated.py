import codecs
import glob

def patch_modal(filepath, max_w):
    with codecs.open(filepath, 'r', 'utf-8') as f:
        content = f.read()
        
    if "if (!isOpen) return null;" not in content:
        return
        
    # Add import
    content = content.replace("import React from 'react';", "import React from 'react';\nimport { AnimatedModal } from '../../components/ui/AnimatedModal';")
    
    # Remove isOpen check
    content = content.replace("  if (!isOpen) return null;\n\n", "")
    content = content.replace("  if (!isOpen) return null;\n", "")
    
    # Replace outer two opening divs
    lines = content.split('\n')
    open_divs = 0
    start_idx = -1
    for i, l in enumerate(lines):
        if "<div className=\"fixed inset-0" in l:
            lines[i] = f"    <AnimatedModal isOpen={{isOpen}} onClose={{onClose}} maxWidth=\"{max_w}\">"
            open_divs += 1
        elif open_divs == 1 and "<div className=\"w-full max-w-" in l:
            lines[i] = ""
            break
            
    # Remove last two closing divs
    divs_to_remove = 2
    for i in range(len(lines)-1, -1, -1):
        if "</div>" in lines[i] and divs_to_remove > 0:
            lines[i] = lines[i].replace("</div>", "", 1)
            divs_to_remove -= 1
        if ");" in lines[i] and divs_to_remove == 0:
            lines.insert(i, "    </AnimatedModal>")
            break
            
    content = '\n'.join(lines)
    
    # Beautiful styling
    content = content.replace('bg-[#e3dcc8]', 'bg-[#111827] border-b border-[#2b4c5e]')
    content = content.replace('bg-[#1e3746]', 'bg-rpg-obsidian text-rpg-paper')
    content = content.replace('bg-[#2b4c5e]', 'bg-[#111827] border border-[#2b4c5e]')

    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)

patch_modal('src/features/character/StatsModal.tsx', 'max-w-lg')
patch_modal('src/features/character/SkillsModal.tsx', 'max-w-3xl')
patch_modal('src/features/character/QuestsModal.tsx', 'max-w-3xl')
patch_modal('src/features/character/JournalModal.tsx', 'max-w-3xl')
patch_modal('src/features/character/NpcsModal.tsx', 'max-w-2xl')
patch_modal('src/features/character/InventoryPanel.tsx', 'max-w-4xl')
patch_modal('src/features/map/MapModal.tsx', 'max-w-4xl')
patch_modal('src/features/ui/SettingsModal.tsx', 'max-w-md')
patch_modal('src/features/ui/PatchNotesModal.tsx', 'max-w-3xl')

print("Modals patched safely")
