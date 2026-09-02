import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Add Loader2 to lucide-react import if not present
if "Loader2" not in content.split("from \"lucide-react\"")[0]:
    content = content.replace(
        'import { Send, Heart, Package, Sword, Shield, FlaskConical, Gem, Shirt, ScrollText, X, Volume2, VolumeX, User, Settings2, Sparkles, Skull, BookOpen, MapPin, Drumstick, Mail } from "lucide-react";',
        'import { Send, Heart, Package, Sword, Shield, FlaskConical, Gem, Shirt, ScrollText, X, Volume2, VolumeX, User, Settings2, Sparkles, Skull, BookOpen, MapPin, Drumstick, Mail, Loader2 } from "lucide-react";'
    )

# 2. Add spinner to the button
target_button = """                  <button 
                    onClick={() => handleAuth(isRegistering)}
                    disabled={loading || !email || !password}
                    className="w-full py-3 bg-[#b74b4b] border-2 border-[#b74b4b] text-[#f4f1e1] font-bold rounded hover:bg-[#d46a6a] transition uppercase tracking-widest shadow-lg disabled:opacity-50"
                  >
                    {isRegistering ? "Vytvořit účet" : "Přihlásit do hry"}
                  </button>"""

replacement_button = """                  <button 
                    onClick={() => handleAuth(isRegistering)}
                    disabled={loading || !email || !password}
                    className="w-full py-3 bg-[#b74b4b] border-2 border-[#b74b4b] text-[#f4f1e1] font-bold rounded hover:bg-[#d46a6a] transition uppercase tracking-widest shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 size={20} className="animate-spin" />}
                    {isRegistering ? "Vytvořit účet" : "Přihlásit do hry"}
                  </button>"""

content = content.replace(target_button, replacement_button)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Loading spinner added!")
