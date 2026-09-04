
const fs = require("fs");
const path = "src/features/character/InventoryPanel.tsx";
let code = fs.readFileSync(path, "utf8");

code = code.replace(
  "    maxHp, ",
  "    maxHp,\n    race, "
);

fs.writeFileSync(path, code);
console.log("Patched race in Inventory!");

