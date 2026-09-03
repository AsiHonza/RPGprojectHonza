import codecs

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'const getTerrainIcon = (terrain: string) => {' in l:
        # replace the next 10 lines
        lines[i+2] = '        case \'Ocean\': return <Waves size={20} className="text-[#1a364a]" />;\n'
        lines[i+3] = '        case \'Mountains\': return <Mountain size={22} className="text-[#2b3a42]" />;\n'
        lines[i+4] = '        case \'Forest\': return <Trees size={22} className="text-[#1b3012]" />;\n'
        lines[i+5] = '        case \'Swamp\': return <Droplets size={20} className="text-[#282d23]" />;\n'
        lines[i+6] = '        case \'Wasteland\': return <Flame size={20} className="text-[#8b3535]" />;\n'
        lines[i+7] = '        case \'Plains\': return null;\n'
    if '<g transform={`translate(${x - 8}, ${y - 8})`} className="pointer-events-none opacity-70 mix-blend-multiply">' in l:
        lines[i] = '                    <g transform={`translate(${x - 10}, ${y - 10})`} className="pointer-events-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">\n'

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
