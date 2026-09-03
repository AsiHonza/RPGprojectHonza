import codecs

lines = codecs.open('src/features/map/MapModal.tsx', 'r', 'utf-8').readlines()

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
"""

for i, l in enumerate(lines):
    if 'const [selectedHex, setSelectedHex] = useState<any>(null);' in l:
        lines.insert(i, translation_funcs)
        break

for i, l in enumerate(lines):
    if '<strong>Terén:</strong> {selectedHex.terrain}' in l:
        lines[i] = l.replace('{selectedHex.terrain}', '{translateTerrain(selectedHex.terrain)}')

with codecs.open('src/features/map/MapModal.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
