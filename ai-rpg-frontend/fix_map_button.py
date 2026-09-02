import codecs

with codecs.open('src/features/ui/PlayerHeader.tsx', 'r', 'utf-8') as f:
    content = f.read()
    
content = content.replace("{worldData && (\n", "")
content = content.replace("                  <Map size={20} className=\"text-rpg-magic\" /> Mapa světa\n                </button>\n              )}", "                  <Map size={20} className=\"text-rpg-magic\" /> Mapa světa\n                </button>")

with codecs.open('src/features/ui/PlayerHeader.tsx', 'w', 'utf-8') as f:
    f.write(content)
