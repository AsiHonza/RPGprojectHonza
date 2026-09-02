import codecs

lines = codecs.open('src/features/map/MapModal.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if "} else if (['Ocean', 'Mountains'].includes(selectedHex.terrain)) {" in l:
        # We also want to change the Ocean restriction. Wait, Ocean is impassable. Mountains are impassable (for now).
        # Wait, earlier I made Mountains impassable. If mountains are impassable, we only check Swamp and Wasteland for the food lock.
        pass

for i, l in enumerate(lines):
    if "canTravel = true;" in l:
        new_logic = """      } else if (['Swamp', 'Wasteland', 'Desert', 'Mountains'].includes(selectedHex.terrain) && rations < 2) {
        travelError = "Nemůžeš vstoupit do tohoto terénu s méně než 2 zásobami jídla. Zabloudil bys a zemřel hlady.";
      } else {
        canTravel = true;
"""
        lines[i] = new_logic
        break

with codecs.open('src/features/map/MapModal.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
