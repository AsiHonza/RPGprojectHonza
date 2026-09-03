import codecs

# 1. Update CharacterCreation.tsx to accept onClose and render the X button
lines = codecs.open('src/features/character/CharacterCreation.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'export const CharacterCreation = ({ startNewGame, loading, backstory, generateBackstory }: any) => {' in l:
        lines[i] = 'export const CharacterCreation = ({ startNewGame, loading, backstory, generateBackstory, onClose }: any) => {\n'
    if '<div className="bg-[#f9f6e6] rounded-xl shadow-2xl p-6 sm:p-12 w-full max-w-4xl min-h-[600px] border border-amber-900/10 flex flex-col' in l:
        lines[i] = l.replace('flex flex-col', 'flex flex-col relative')
    if '<h2 className="text-3xl sm:text-4xl font-bold font-lora text-slate-900">' in l:
        lines.insert(i, '        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition">\n          <X size={28} />\n        </button>\n')
        break

# Add import for X if missing
has_x = False
for l in lines:
    if 'import { X ' in l or 'import { X,' in l or ', X } from "lucide-react"' in l:
        has_x = True
if not has_x:
    for i, l in enumerate(lines):
        if 'lucide-react' in l:
            lines[i] = l.replace('} from "lucide-react"', ', X } from "lucide-react"')
            break

with codecs.open('src/features/character/CharacterCreation.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))

# 2. Update page.tsx to pass onClose
lines2 = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines2):
    if '<CharacterCreation ' in l:
        lines2[i] = l.replace('<CharacterCreation ', '<CharacterCreation onClose={() => setGameState("menu")} ')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines2))
