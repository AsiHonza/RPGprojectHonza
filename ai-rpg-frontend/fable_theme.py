import codecs
import re

def apply_fable_theme(filepath):
    lines = codecs.open(filepath, 'r', 'utf-8').readlines()
    
    for i, l in enumerate(lines):
        # Backgrounds from slate/black to warm enchanted tones
        l = l.replace('bg-slate-950', 'bg-stone-900')
        l = l.replace('bg-slate-900', 'bg-amber-950')
        l = l.replace('bg-black/60', 'bg-stone-900/60')
        l = l.replace('bg-black/40', 'bg-stone-900/40')
        l = l.replace('bg-black/50', 'bg-stone-900/50')
        l = l.replace('bg-black/80', 'bg-stone-900/80')
        
        # Gradients
        l = l.replace('from-slate-950 via-slate-950/70 to-slate-900/40', 'from-stone-950 via-stone-900/60 to-amber-900/20')
        l = l.replace('from-slate-900/20 via-slate-950/80 to-slate-950', 'from-amber-900/20 via-stone-900/80 to-stone-950')
        
        # Borders and highlights
        l = l.replace('border-white/10', 'border-amber-500/20')
        l = l.replace('border-white/5', 'border-amber-500/10')
        l = l.replace('bg-white/5', 'bg-amber-500/5')
        
        # Text colors
        l = l.replace('text-gray-400', 'text-amber-200/70')
        l = l.replace('text-gray-300', 'text-amber-50')
        l = l.replace('text-gray-200', 'text-amber-100')
        
        # Patterns
        l = l.replace('black-scales.png', 'wood-pattern.png')
        
        # Prompts for pollinators
        l = l.replace('epic%20high%20fantasy%20portrait', 'vibrant%20fable%20storybook%20fantasy%20portrait')
        
        lines[i] = l
        
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write("".join(lines))

apply_fable_theme('src/app/page.tsx')
apply_fable_theme('src/features/character/CharacterCreation.tsx')

