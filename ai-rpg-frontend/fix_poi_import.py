import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Fix import
content = content.replace('MapPin } from "lucide-react";', 'MapPin, Drumstick } from "lucide-react";')

# Fix poi map
# It currently says: {pointsOfInterest.map((poi, i) => ( ... {poi} ... ))}
content = re.sub(
    r'\{pointsOfInterest\.map\(\(poi, i\) => \(\s*<button\s*key=\{\`poi-\$\{i\}\`\}\s*onClick=\{\(\) => sendAction\(\`Jdu prozkoumat: \$\{poi\}\`\)\}\s*className="bg-\[\#d4af37\].*?\{poi\}\s*</button>\s*\)\)\}',
    r'''{locationType !== 'mesto' && pointsOfInterest.map((poi, i) => (
                  <button 
                    key={`poi-${i}`} 
                    onClick={() => sendAction(`Jdu prozkoumat: ${poi.nazev}`)}
                    className="bg-[#d4af37] text-[#1a120b] font-bold px-4 py-2 rounded-sm text-sm hover:bg-[#f4ecd8] transition-all shadow-md border border-[#d4af37] font-serif flex items-center gap-1"
                  >
                    <MapPin size={16} className="opacity-70" /> {poi.nazev}
                  </button>
                ))}''',
    content, flags=re.DOTALL
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Fixed!")
