import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Replace the Map Modal content
start = content.find('{/* Interactive Canvas */}')
end = content.find('</div>\n              </div>\n            </div>\n          </div>', start)

if start != -1 and end != -1:
    new_content = """{/* Interactive Canvas */}
                <div className="relative w-full h-full min-h-[600px]">
                  <HexMap 
                    worldData={worldData} 
                    onHexClick={(hex) => {
                      if(hex.nazev) {
                        setSelectedItem({
                           id: `${hex.q}_${hex.r}`,
                           name: hex.nazev,
                           desc: hex.popis || (hex.is_poi ? "Zajímavé místo..." : "Divoká příroda"),
                           type: hex.poi_type || hex.terrain
                        });
                      }
                    }} 
                  />
"""
    content = content[:start] + new_content + content[end:]
    
    # Add import HexMap
    if "import HexMap" not in content:
        content = content.replace('import { Play', 'import HexMap from "../components/map/HexMap";\nimport { Play')
        
    with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
        f.write(content)
    print("Map UI updated")
else:
    print("Map Modal content not found")
