import codecs
import glob
import re

modal_files = glob.glob('src/features/**/*.tsx', recursive=True)

for filepath in modal_files:
    if "PlayerHeader" in filepath or "StoryLog" in filepath or "CharacterCreation" in filepath or "CharacterStatsPanel" in filepath:
        continue
        
    with codecs.open(filepath, 'r', 'utf-8') as f:
        content = f.read()

    if "if (!isOpen) return null;" not in content and "isOpen" not in content:
        continue
        
    # We want to replace the outer two divs with AnimatedModal
    # Usually:
    #   if (!isOpen) return null;
    #   return (
    #     <div className="fixed inset-0 ...">
    #       <div className="w-full max-w-X ...">
    #         CONTENT
    #       </div>
    #     </div>
    #   );
    
    # 1. Add import for AnimatedModal
    if "AnimatedModal" not in content:
        content = content.replace("import React", "import React\nimport { AnimatedModal } from '../../components/ui/AnimatedModal';")
        content = content.replace("import { AnimatedModal } from '../../components/ui/AnimatedModal';\nfrom", "import { AnimatedModal } from '../../components/ui/AnimatedModal';\nimport")
        
    # Remove if (!isOpen) return null;
    content = content.replace("if (!isOpen) return null;", "")
    
    # Extract max-w
    max_w_match = re.search(r'max-w-[a-z0-9]+', content)
    max_w = max_w_match.group(0) if max_w_match else "max-w-2xl"
    
    # Replace the two opening divs
    # Find return (
    return_split = content.split('return (')
    if len(return_split) > 1:
        after_return = return_split[1]
        
        # Replace the first two <div>s
        after_return = re.sub(r'\s*<div className="fixed[^>]*>\s*<div className="w-full[^>]*>', f'\n    <AnimatedModal isOpen={{isOpen}} onClose={{onClose}} maxWidth="{max_w}">', after_return, count=1)
        
        # Replace the last two </div>s before the );
        # We need to find the last two </div> that match
        # Let's do a simple replace from the end
        lines = after_return.split('\n')
        div_count = 0
        for i in range(len(lines)-1, -1, -1):
            if "</div>" in lines[i]:
                lines[i] = lines[i].replace("</div>", "", 1)
                div_count += 1
                if div_count == 2:
                    break
                    
        # And add closing AnimatedModal before );
        for i in range(len(lines)-1, -1, -1):
            if ");" in lines[i]:
                lines.insert(i, "    </AnimatedModal>")
                break
                
        after_return = '\n'.join(lines)
        content = return_split[0] + 'return (' + after_return
        
    # Add beautiful styling to the header of the modal
    content = content.replace('bg-[#e3dcc8]', 'bg-[#111827] border-b border-[#2b4c5e]')
    content = content.replace('bg-[#1e3746]', 'bg-rpg-obsidian text-rpg-paper')
    content = content.replace('bg-[#2b4c5e]', 'bg-[#111827] border border-[#2b4c5e]')
    
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)

print("Modals refactored")
