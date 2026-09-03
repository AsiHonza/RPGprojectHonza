import re

with open('src/features/character/CharacterCreation.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add Loader2 to imports
text = text.replace(
    "import { Settings2, Sparkles, ChevronRight, ChevronLeft, Crown, Shield, Wand2, Axe, Ghost, Skull, Book, Flame, X } from 'lucide-react';",
    "import { Settings2, Sparkles, ChevronRight, ChevronLeft, Crown, Shield, Wand2, Axe, Ghost, Skull, Book, Flame, X, Loader2 } from 'lucide-react';"
)

# Add the loading overlay inside the root div
root_div = '    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">'
overlay = '''
      {loading && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-not-allowed">
           <div className="flex flex-col items-center gap-4 p-8 bg-[#f9f6e6] rounded-2xl shadow-2xl border border-rpg-magic/30">
              <Loader2 className="w-12 h-12 text-rpg-magic animate-spin" />
              <p className="text-xl font-cinzel text-slate-800 text-center">Tvoøím tvou Legendu...<br/><span className="text-sm font-lora text-slate-600">Prosím strpení, AI generuje svìt.</span></p>
           </div>
        </div>
      )}
'''

text = text.replace(root_div, root_div + overlay)

with open('src/features/character/CharacterCreation.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
