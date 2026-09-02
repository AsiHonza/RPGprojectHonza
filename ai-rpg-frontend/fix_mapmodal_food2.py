import codecs

lines = codecs.open('src/features/map/MapModal.tsx', 'r', 'utf-8').readlines()

new_logic = """  if (selectedHex && playerLocation) {
    dist = hexDistance(playerLocation.q, playerLocation.r, selectedHex.q, selectedHex.r);
    if (dist === 0) {
      travelError = "Už jsi tady.";
    } else if (dist > 1) {
      travelError = "Můžeš cestovat jen o 1 hex.";
    } else if (['Ocean'].includes(selectedHex.terrain)) {
      travelError = "Neprostupný oceán.";
    } else if (['Swamp', 'Wasteland', 'Desert', 'Mountains'].includes(selectedHex.terrain) && rations < 2) {
      travelError = "Do nehostinného terénu potřebuješ alespoň 2 zásoby jídla (Zemřel bys hlady).";
    } else {
      canTravel = true;
    }
  }
"""

start_idx = -1
end_idx = -1
for i, l in enumerate(lines):
    if "if (selectedHex && playerLocation) {" in l:
        start_idx = i
    if start_idx != -1 and "return (" in l:
        end_idx = i - 1
        break

lines = lines[:start_idx] + [new_logic] + lines[end_idx:]

with codecs.open('src/features/map/MapModal.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
