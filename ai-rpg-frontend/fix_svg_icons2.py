import codecs

content = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').read()

import re

# Replace terrain foreignObject
content = re.sub(
    r'\{!hexData\.poi && \(\s*<foreignObject[^>]*>\s*<div[^>]*>\s*\{getTerrainIcon\(hexData\.terrain\)\}\s*</div>\s*</foreignObject>\s*\)\}',
    r'{!hexData.poi && (\n                    <g transform={`translate(${x - 8}, ${y - 8})`} className="pointer-events-none opacity-70 mix-blend-multiply">\n                      {getTerrainIcon(hexData.terrain)}\n                    </g>\n                  )}',
    content
)

# Replace player pawn foreignObject
content = re.sub(
    r'\{playerLocation\?\.q === hexData\.q && playerLocation\?\.r === hexData\.r && \(\s*<foreignObject[^>]*>\s*<div[^>]*>\s*<User[^>]*/>\s*</div>\s*</foreignObject>\s*\)\}',
    r'{playerLocation?.q === hexData.q && playerLocation?.r === hexData.r && (\n                    <g transform={`translate(${x - 12}, ${y - 12})`} className="pointer-events-none z-50 animate-bounce text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.9)]">\n                      <User size={24} strokeWidth={3} />\n                    </g>\n                  )}',
    content
)

# Replace poi foreignObject
content = re.sub(
    r'\{hexData\.poi && \(\s*<foreignObject[^>]*>\s*<div[^>]*>\s*\{getPoiIcon\(hexData\.poi\)\}\s*</div>\s*</foreignObject>\s*\)\}',
    r'{hexData.poi && (\n                    <g transform={`translate(${x - 10}, ${y - 10})`} className="pointer-events-none z-10">\n                      {getPoiIcon(hexData.poi)}\n                    </g>\n                  )}',
    content
)

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write(content)
