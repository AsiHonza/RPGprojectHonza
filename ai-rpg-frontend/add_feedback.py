import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Add Mail to lucide-react import (if not already done)
if "Mail" not in content.split("from \"lucide-react\"")[0]:
    content = content.replace(
        'import { Send, Heart, Package, Sword, Shield, FlaskConical, Gem, Shirt, ScrollText, X, Volume2, VolumeX, User, Settings2, Sparkles, Skull, BookOpen, MapPin, Drumstick } from "lucide-react";',
        'import { Send, Heart, Package, Sword, Shield, FlaskConical, Gem, Shirt, ScrollText, X, Volume2, VolumeX, User, Settings2, Sparkles, Skull, BookOpen, MapPin, Drumstick, Mail } from "lucide-react";'
    )

# 2. Add to Login Screen
pattern_login = r'(<\!-- LOGIN SCREEN -->|if \(gameState === "menu"\) \{[\s\S]*?)(\s*<\/div>\s*<\/div>\s*\);\s*\})'
replacement_login = r"""\1
        <div className="mt-6 text-center">
          <a href="mailto:janmlcak6@gmail.com?subject=Zpětná vazba - Aethelgard" className="text-[#90a4ae] hover:text-[#e3dcc8] transition text-sm flex items-center justify-center gap-2">
            <Mail size={16} /> Máte nápad nebo problém? Napište mi.
          </a>
        </div>\2"""

if "Máte nápad nebo problém" not in content:
    content = re.sub(pattern_login, replacement_login, content, count=1)

# 3. Add to Settings Modal
pattern_settings = r'(<div className="space-y-6">[\s\S]*?)(<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\})'
replacement_settings = r"""\1
              <div className="pt-4 mt-6 border-t border-[#90a4ae]">
                <a href="mailto:janmlcak6@gmail.com?subject=Zpětná vazba - Aethelgard" className="w-full py-2 bg-[#2b4c5e] text-[#f4f1e1] rounded font-bold hover:bg-[#1e3746] transition flex justify-center items-center gap-2">
                  <Mail size={18} /> Odeslat zpětnou vazbu
                </a>
              </div>
\2"""

if "Odeslat zpětnou vazbu" not in content:
    content = re.sub(pattern_settings, replacement_settings, content, count=1)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Feedback buttons added!")
