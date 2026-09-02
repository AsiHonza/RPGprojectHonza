import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Add Trash2 to lucide-react import
if "Trash2" not in content.split("from \"lucide-react\"")[0]:
    content = content.replace(
        'import { Send, Heart, Package, Sword, Shield, FlaskConical, Gem, Shirt, ScrollText, X, Volume2, VolumeX, User, Settings2, Sparkles, Skull, BookOpen, MapPin, Drumstick, Mail, Loader2 } from "lucide-react";',
        'import { Send, Heart, Package, Sword, Shield, FlaskConical, Gem, Shirt, ScrollText, X, Volume2, VolumeX, User, Settings2, Sparkles, Skull, BookOpen, MapPin, Drumstick, Mail, Loader2, Trash2 } from "lucide-react";'
    )

# 2. Add deleteCharacter function
delete_fn = """
  const deleteCharacter = async (e: any, characterName: string) => {
    e.stopPropagation();
    if (!confirm(`Opravdu chceš smazat postavu ${characterName}? Tato akce je nevratná.`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/delete-character`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: characterName })
      });
      if (!res.ok) throw new Error("Nepodařilo se smazat postavu.");
      fetchCharacters(email);
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };
"""

if "const deleteCharacter" not in content:
    content = content.replace(
        '  const loadGame = async (characterName: string) => {',
        delete_fn + '\n  const loadGame = async (characterName: string) => {'
    )

# 3. Update character selection button to include a Trash icon
char_button_pattern = r'(<button\s*key=\{idx\}\s*onClick=\{\(\) => loadGame\(char\.name\)\}\s*className="w-full p-3 bg-\[#e3dcc8\] border border-\[#90a4ae\] text-left rounded hover:border-\[#b74b4b\] transition group flex items-center gap-3"\s*>)(\s*<div[\s\S]*?<\/div>\s*<div>\s*<div[\s\S]*?<\/div>\s*<div[\s\S]*?<\/div>\s*<\/div>\s*)(<\/button>)'

char_button_replacement = r"""\1\2
                    <div className="ml-auto flex items-center">
                      <div 
                        onClick={(e) => deleteCharacter(e, char.name)}
                        className="p-2 text-[#90a4ae] hover:text-[#b74b4b] hover:bg-[#f4f1e1] rounded transition"
                        title="Smazat postavu"
                      >
                        <Trash2 size={20} />
                      </div>
                    </div>
\3"""

content = re.sub(char_button_pattern, char_button_replacement, content)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Delete UI added!")
