import codecs

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()

# add playerLocation to imports and props
for i, l in enumerate(lines):
    if "import { Castle" in l:
        lines[i] = l.replace("import { Castle", "import { User, Castle")
    if "interface HexMapProps {" in l:
        lines.insert(i+1, "  playerLocation?: {q: number, r: number} | null;\n")
        break

for i, l in enumerate(lines):
    if "export default function HexMap" in l:
        lines[i] = "export default function HexMap({ worldData, onHexClick, setSelectedItem, playerLocation }: HexMapProps) {\n"
        break

# render pawn
for i, l in enumerate(lines):
    if "{/* POI Icon */}" in l:
        pawn_code = """
                {/* Player Pawn */}
                {playerLocation?.q === hexData.q && playerLocation?.r === hexData.r && (
                  <foreignObject 
                    x={x + HEX_SIZE - 12} 
                    y={y + HEX_SIZE * 0.866 - 20} 
                    width={24} 
                    height={24}
                    className="pointer-events-none overflow-visible z-50 animate-bounce"
                  >
                    <div className="flex items-center justify-center w-full h-full text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.9)]">
                      <User size={24} strokeWidth={3} />
                    </div>
                  </foreignObject>
                )}
"""
        lines.insert(i, pawn_code)
        break

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
