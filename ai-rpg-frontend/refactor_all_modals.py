import codecs
import glob
import re

modal_files = glob.glob('src/features/**/*.tsx', recursive=True)

for filepath in modal_files:
    if "PlayerHeader" in filepath or "StoryLog" in filepath or "CharacterCreation" in filepath or "CharacterStatsPanel" in filepath or "StatsModal" in filepath:
        continue
        
    with codecs.open(filepath, 'r', 'utf-8') as f:
        content = f.read()

    if "if (!isOpen) return null;" not in content:
        continue
        
    # Import Framer Motion
    content = content.replace("import React from 'react';", "import React from 'react';\nimport { motion, AnimatePresence } from 'framer-motion';")
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { motion, AnimatePresence } from 'framer-motion';")
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { motion, AnimatePresence } from 'framer-motion';")

    # Change if (!isOpen) return null; to AnimatePresence
    content = content.replace("  if (!isOpen) return null;\n\n  return (", "  return (\n    <AnimatePresence>\n      {isOpen && (")
    content = content.replace("  if (!isOpen) return null;\n  return (", "  return (\n    <AnimatePresence>\n      {isOpen && (")

    # Replace first div with motion.div
    content = re.sub(
        r'<div className="fixed inset-0 [^>]+>',
        r'<motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">',
        content,
        count=1
    )
    
    # Replace second div (usually max-w-...) with motion.div
    content = re.sub(
        r'<div className="w-full max-w-[a-z0-9]+ [^>]+>',
        lambda m: m.group(0).replace('<div', '<motion.div initial={{scale: 0.95, y: 20}} animate={{scale: 1, y: 0}} exit={{scale: 0.95, y: 20}}').replace('border-[#90a4ae]', 'border-[#455a64]').replace('border-4', 'border').replace('bg-[#2b4c5e]', 'bg-rpg-obsidian'),
        content,
        count=1
    )

    # Find the last two </div> and replace with </motion.div>
    lines = content.split('\n')
    divs_replaced = 0
    for i in range(len(lines)-1, -1, -1):
        if "</div>" in lines[i]:
            lines[i] = lines[i].replace("</div>", "</motion.div>")
            divs_replaced += 1
            if divs_replaced == 2:
                break
                
    # Close AnimatePresence
    for i in range(len(lines)-1, -1, -1):
        if ");" in lines[i]:
            lines.insert(i, "      )}\n    </AnimatePresence>")
            break

    content = '\n'.join(lines)

    # Style changes for high fantasy minimalism
    content = content.replace('bg-[#e3dcc8]', 'bg-[#111827] text-rpg-paper border-b border-[#2b4c5e]')
    content = content.replace('bg-[#1e3746]', 'bg-[#111827]')
    content = content.replace('bg-[#1b262c]', 'bg-rpg-obsidian')
    content = content.replace('bg-[#2b4c5e]', 'bg-[#111827] border border-[#2b4c5e]')
    content = content.replace('text-[#b74b4b]', 'text-rpg-magic')
    
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)

print("All modals updated with framer-motion and new styles")
