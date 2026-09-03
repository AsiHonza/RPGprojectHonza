import codecs

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()

translation_funcs = """
  const translateTerrain = (t: string) => {
    switch(t) {
      case 'Ocean': return 'Oceán';
      case 'Mountains': return 'Hory';
      case 'Forest': return 'Les';
      case 'Swamp': return 'Bažina';
      case 'Wasteland': return 'Pustina';
      case 'Plains': return 'Pláně';
      default: return t;
    }
  };

  const translatePoi = (p: string) => {
    switch(p) {
      case 'Capital': return 'Hlavní Město';
      case 'Village': return 'Vesnice';
      case 'Dungeon': return 'Temnice';
      case 'Shrine': return 'Svatyně';
      case 'Ruin': return 'Ruina';
      default: return p;
    }
  };
"""

for i, l in enumerate(lines):
    if 'const getKingdomColor = (k_id: number | null) => {' in l:
        lines.insert(i, translation_funcs)
        break

for i, l in enumerate(lines):
    if '{hoveredHex.terrain}' in l:
        lines[i] = l.replace('{hoveredHex.terrain}', '{translateTerrain(hoveredHex.terrain)}')
    if '{hoveredHex.poi}' in l and 'div' not in l:
        lines[i] = l.replace('{hoveredHex.poi}', '{translatePoi(hoveredHex.poi)}')

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
