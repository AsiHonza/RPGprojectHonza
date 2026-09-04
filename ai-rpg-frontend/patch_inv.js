
const fs = require("fs");
const path = "src/features/character/InventoryPanel.tsx";
let code = fs.readFileSync(path, "utf8");

// Add imports
code = code.replace(
  "import { useGameStore } from '../../store/gameStore';",
  "import { useGameStore } from '../../store/gameStore';\nimport { RACES } from '../../data/races';"
);

const raceTraitUI = `
            {/* Racial Trait */}
            {RACES[race]?.trait && (
              <div className="bg-[#fdfbf2] border border-amber-900/20 p-4 rounded-xl text-slate-800 shadow-sm">
                <h3 className="uppercase font-cinzel font-bold text-xs tracking-widest text-amber-950 border-b border-amber-900/10 pb-2 mb-2 flex justify-between items-center">
                  <span>Rasový Rys: {RACES[race].trait.name}</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-lora">Pasivní</span>
                </h3>
                <p className="text-sm font-lora italic text-slate-600">
                  {RACES[race].trait.description}
                </p>
              </div>
            )}
`;

code = code.replace(
  /{[\s\S]*?\/\* Combat Totals & RPG Stats \*\//,
  match => raceTraitUI + "\n" + match
);

fs.writeFileSync(path, code);
console.log("Patched Inventory!");

