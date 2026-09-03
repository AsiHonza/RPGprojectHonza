import codecs

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'const getPoiIcon = (poi: string) => {' in l:
        lines[i+3] = '      case \'Capital\': return <Castle size={24} className="text-rpg-magic drop-shadow-[0_0_5px_rgba(197,160,89,0.9)]" />;\n'
        lines[i+4] = '      case \'Village\': return <Home size={22} className="text-slate-700 drop-shadow-md" />;\n'
        lines[i+5] = '      case \'Dungeon\': return <Skull size={22} className="text-rpg-blood drop-shadow-[0_0_5px_rgba(183,75,75,0.9)]" />;\n'
        lines[i+6] = '      case \'Shrine\': return <Star size={22} className="text-indigo-800 drop-shadow-[0_0_5px_rgba(165,180,252,0.9)]" />;\n'
        lines[i+7] = '      case \'Ruin\': return <Eye size={22} className="text-[#455a64] drop-shadow-md" />;\n'
        lines[i+8] = '      default: return <MapPin size={20} className="text-slate-800" />;\n'

    # And for player pawn, make it even more obvious if needed, but it's already red
    
with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
