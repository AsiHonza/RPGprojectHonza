const fs = require("fs");
const path = "src/features/combat/CombatArena.tsx";
let code = fs.readFileSync(path, "utf8");

code = code.replace(
  "import { getSkillsForWeapon, WeaponSkill } from './weaponSkills';",
  "import { getSkillsForWeapon, WeaponSkill } from './weaponSkills';\nimport { RACES } from '../../data/races';"
);

// Add missing state for usedRelentlessEndurance and dragonBreathCooldown
code = code.replace(
  "const logEndRef = useRef<HTMLDivElement>(null);",
  "const logEndRef = useRef<HTMLDivElement>(null);\n  const [usedRelentless, setUsedRelentless] = useState(false);\n  const [dragonCooldown, setDragonCooldown] = useState(0);"
);

// Update max AP calculation
code = code.replace(
  "const mainHandWeaponId = equipped[",
  "const { race } = useGameStore();\n  const maxAP = RACES[race]?.trait.id === 'human_versatility' ? 4 : 3;\n  \n  const mainHandWeaponId = equipped["
);

// Update setCombatAp(3) -> setCombatAp(maxAP)
code = code.replace(
  "setCombatAp(3); // Reset AP",
  "setCombatAp(maxAP); // Reset AP"
);

// Update [1,2,3] map to dynamic AP array
code = code.replace(
  "{[1,2,3].map(i => (",
  "{Array.from({length: maxAP}, (_, i) => i + 1).map(i => ("
);

// Update executePlayerAttack call
code = code.replace(
  "executePlayerAttack(skill, targetId, enemies, stats);",
  "executePlayerAttack(skill, targetId, enemies, stats, race);"
);

// Update executeEnemyTurn call
code = code.replace(
  "const { updatedPlayerHp, logEntries, updatedEnemies } = executeEnemyTurn(enemies, hp);",
  "const { updatedPlayerHp, logEntries, updatedEnemies, usedRelentlessEndurance } = executeEnemyTurn(enemies, hp, race, usedRelentless);\n      setUsedRelentless(usedRelentlessEndurance);"
);

// Dragon Breath handling
const handleDragonBreath = \
  const handleDragonBreath = () => {
    if (combatAp < 2 || isEnemyTurn || dragonCooldown > 0) return;
    setCombatAp(combatAp - 2);
    setDragonCooldown(3);
    
    let newEnemies = [...enemies];
    let logStr = "🔥 **Dračí dech!** Vydechl jsi vlnu plamenů na všechny nepřátele! ";
    
    newEnemies.forEach(e => {
      if (e.hp > 0) {
        const dmg = Math.floor(Math.random() * 6) + 1 + (stats.cha ? Math.floor((stats.cha - 10) / 2) : 0);
        e.hp -= Math.max(1, dmg);
        logStr += \ [\: \ dmg]\;
      }
    });
    
    setEnemies(newEnemies);
    addLog(logStr);
    
    setTimeout(() => {
      handleEnemyTurn(newEnemies);
    }, 1500);
  };
\;

code = code.replace(
  "const handlePlayerAction = (skill: WeaponSkill) => {",
  handleDragonBreath + "\n  const handlePlayerAction = (skill: WeaponSkill) => {"
);

// Add dragon breath UI button
const dragonBreathUI = \
            {/* Dragon Breath */}
            {RACES[race]?.trait.id === 'dragon_breath' && (
              <button
                disabled={combatAp < 2 || isEnemyTurn || dragonCooldown > 0}
                onClick={handleDragonBreath}
                className={\lex flex-col items-start p-2 rounded-lg border-2 transition-all min-w-[110px]
                  \\}
              >
                <div className="flex justify-between w-full items-center mb-1">
                  <span className="text-base">🔥</span>
                  <div className="flex">
                    <div className={\w-2 h-2 rounded-full border border-blue-800 \\} />
                    <div className={\w-2 h-2 rounded-full border border-blue-800 \\} />
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-red-900 font-cinzel leading-tight">Dračí Dech</div>
                  <div className="text-[9px] text-red-700 leading-tight mt-0.5">AoE Oheň</div>
                </div>
                {dragonCooldown > 0 && <div className="text-[10px] text-red-600 font-bold mt-1">🔄 Cooldown: {dragonCooldown}</div>}
              </button>
            )}
\;

code = code.replace(
  "{weaponSkills.map(skill => (",
  dragonBreathUI + "\n            {weaponSkills.map(skill => ("
);

// Reduce cooldown on round start
code = code.replace(
  "setCombatRound(combatRound + 1);",
  "setCombatRound(combatRound + 1);\n      setDragonCooldown(prev => Math.max(0, prev - 1));"
);

fs.writeFileSync(path, code);
console.log("Patched CombatArena.tsx!");
