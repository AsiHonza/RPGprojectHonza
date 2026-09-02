import codecs
import glob
import re

modal_files = glob.glob('src/features/**/*.tsx', recursive=True)

for filepath in modal_files:
    if "PlayerHeader" in filepath or "StoryLog" in filepath or "CharacterCreation" in filepath or "CharacterStatsPanel" in filepath:
        continue
        
    with codecs.open(filepath, 'r', 'utf-8') as f:
        content = f.read()

    if "if (!isOpen) return null;" not in content:
        continue
        
    # Add import correctly (after the first import)
    if "AnimatedModal" not in content:
        content = re.sub(r'^(import .*?;)', r'\1\nimport { AnimatedModal } from "../../components/ui/AnimatedModal";', content, count=1, flags=re.MULTILINE)
        
    # Remove if (!isOpen) return null;
    content = content.replace("  if (!isOpen) return null;\n\n", "")
    content = content.replace("  if (!isOpen) return null;\n", "")
    
    # Extract max-w
    max_w_match = re.search(r'max-w-[a-z0-9]+', content)
    max_w = max_w_match.group(0) if max_w_match else "max-w-2xl"
    
    # Replace the wrapper divs
    # Find the outer wrapper: <div className="fixed inset-0 ...">
    content = re.sub(r'\s*<div className="fixed inset-0[^>]*>', f'\n    <AnimatedModal isOpen={{isOpen}} onClose={{onClose}} maxWidth="{max_w}">', content, count=1)
    
    # Find the inner wrapper: <div className="w-full max-w-... overflow-hidden flex flex-col">
    # Note: Sometimes it has max-h-[90vh], we can just match <div className="w-full ...">
    content = re.sub(r'\s*<div className="w-full[^>]*>', '', content, count=1)
    
    # Now we need to remove the two closing </div>s before );
    # Let's match: </div>\n        </div>\n\n      )} or similar
    # A simpler way: Find the last ); and remove two </div> before it.
    
    lines = content.split('\n')
    div_count = 0
    for i in range(len(lines)-1, -1, -1):
        if "</div>" in lines[i]:
            lines[i] = lines[i].replace("</div>", "", 1)
            div_count += 1
            if div_count == 2:
                break
                
    # Add </AnimatedModal> before );
    for i in range(len(lines)-1, -1, -1):
        if ");" in lines[i]:
            lines.insert(i, "    </AnimatedModal>")
            break
            
    content = '\n'.join(lines)
    
    # Beautiful styling
    content = content.replace('bg-[#e3dcc8]', 'bg-[#111827] border-b border-[#2b4c5e]')
    content = content.replace('bg-[#1e3746]', 'bg-rpg-obsidian text-rpg-paper')
    content = content.replace('bg-[#2b4c5e]', 'bg-[#111827] border border-[#2b4c5e]')
    
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)

print("Modals refactored")
