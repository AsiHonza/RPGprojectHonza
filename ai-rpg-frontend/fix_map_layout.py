import codecs

# 1. Update HexMap.tsx
lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    # Translations
    if "case 'Wasteland': return <Flame" in l:
        lines[i] = "      case 'Wasteland': return <Flame size={14} className=\"text-[#b74b4b]/60\" />;\n"
    if "case 'Ocean': return" in l:
        lines[i] = l.replace("'Ocean'", "'Oceán'")
    elif "case 'Mountains': return" in l:
        lines[i] = l.replace("'Mountains'", "'Hory'")
    elif "case 'Forest': return" in l:
        lines[i] = l.replace("'Forest'", "'Les'")
    elif "case 'Swamp': return" in l:
        lines[i] = l.replace("'Swamp'", "'Bažina'")
    elif "case 'Wasteland': return" in l:
        lines[i] = l.replace("'Wasteland'", "'Pustina'")
    elif "case 'Plains': return" in l:
        lines[i] = l.replace("'Plains'", "'Pláně'")
        
    if "case 'Capital': return" in l:
        lines[i] = l.replace("'Capital'", "'Hlavní Město'")
    elif "case 'Village': return" in l:
        lines[i] = l.replace("'Village'", "'Vesnice'")
    elif "case 'Dungeon': return" in l:
        lines[i] = l.replace("'Dungeon'", "'Temnice'")
    elif "case 'Shrine': return" in l:
        lines[i] = l.replace("'Shrine'", "'Svatyně'")
    elif "case 'Ruin': return" in l:
        lines[i] = l.replace("'Ruin'", "'Ruina'")

    # Perfect centering for terrain icons
    if '{terrainIcon && (' in l:
        # replace the next 5 lines
        for j in range(1, 6):
            if 'x=' in lines[i+j]: lines[i+j] = '                      x={x - 14}\n'
            if 'y=' in lines[i+j]: lines[i+j] = '                      y={y - 16}\n'
            if 'width=' in lines[i+j]: lines[i+j] = '                      width={28}\n'
            if 'height=' in lines[i+j]: lines[i+j] = '                      height={32}\n'
            if 'className="pointer-events-none opacity-50 z-0 mix-blend-multiply"' in lines[i+j]:
                lines[i+j] = '                      className="pointer-events-none z-0 mix-blend-multiply opacity-70"\n'

    # Perfect centering for POI
    if '{hexData.poi && (' in l:
        # Check next lines
        for j in range(1, 7):
            if 'x=' in lines[i+j]: lines[i+j] = '                      x={x - 14}\n'
            if 'y=' in lines[i+j]: lines[i+j] = '                      y={y - 16}\n'
            if 'width=' in lines[i+j]: lines[i+j] = '                      width={28}\n'
            if 'height=' in lines[i+j]: lines[i+j] = '                      height={32}\n'

    # Perfect centering for Player Pawn
    if '{playerLocation?.q === hexData.q && playerLocation?.r === hexData.r && (' in l:
        for j in range(1, 7):
            if 'x=' in lines[i+j]: lines[i+j] = '                      x={x - 14}\n'
            if 'y=' in lines[i+j]: lines[i+j] = '                      y={y - 16}\n'
            if 'width=' in lines[i+j]: lines[i+j] = '                      width={28}\n'
            if 'height=' in lines[i+j]: lines[i+j] = '                      height={32}\n'

    # Add a glowing player hex ring on the polygon
    if '<polygon' in l and 'points={points}' in lines[i+1]:
        lines[i+2] = lines[i+2].replace('className={`${getKingdomColor(hexData.kingdom_id)} stroke-[#455a64]/20 stroke-[0.5]', 'className={`${getKingdomColor(hexData.kingdom_id)} ${(playerLocation?.q === hexData.q && playerLocation?.r === hexData.r) ? "stroke-red-600 stroke-[2] drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" : "stroke-[#455a64]/30 stroke-[1]"}')


with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))


# 2. Update MapModal.tsx text contrast
lines2 = codecs.open('src/features/map/MapModal.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines2):
    if '<ul className="text-rpg-blood">' in l:
        lines2[i] = l.replace('text-rpg-blood', 'text-amber-900 font-bold')

with codecs.open('src/features/map/MapModal.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines2))

