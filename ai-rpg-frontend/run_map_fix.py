import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
start_idx = -1
end_idx = -1

for i, l in enumerate(lines):
    if '<div className="relative w-full h-full min-h-[600px] p-10">' in l:
        start_idx = i
        break

# The block ends after the svg and the locations loop.
# Wait, let's just count divs?
# Or just find the first "</div>\n" that matches the indent of start_idx.
# Better: just replace from start_idx to the end of the location loop which is around 1792.
if start_idx != -1:
    # Let's find the `</svg>`
    for j in range(start_idx, start_idx+50):
        if '</svg>' in lines[j]:
            end_svg = j
            break
            
    # And then there's the location points
    for k in range(end_svg, end_svg+50):
        if '</div>' in lines[k] and '</div>' in lines[k+1] and '</div>' in lines[k+2]:
            end_idx = k
            break
            
    print(start_idx, end_idx)

    if end_idx != -1:
        new_content = """                <div className="relative w-full h-full min-h-[600px]">
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
        lines = lines[:start_idx] + [new_content] + lines[end_idx+1:]
        
        content = "".join(lines)
        if "import HexMap" not in content:
            content = content.replace('import { Play', 'import HexMap from "../components/map/HexMap";\nimport { Play')
            
        with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
            f.write(content)
        print("Map UI updated")
