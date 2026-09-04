
import re

path = "src/features/combat/combatEngine.ts"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

code = "import { RACES } from \"../../data/races\";\n" + code

code = code.replace(
    "playerStats: any",
    "playerStats: any,\n  playerRace: string"
)

code = code.replace(
    "const d20 = rollDie(20);",
    """let d20 = rollDie(20);
  if (d20 === 1 && RACES[playerRace]?.trait.id === "halfling_luck") {
    d20 = rollDie(20);
    logEntry += "🍀 Půlčíkovo štěstí tě zachránilo před kritickým neúspěchem! ";
  }"""
)

code = code.replace(
    "playerHp: number",
    "playerHp: number,\n  playerRace: string,\n  usedRelentlessEndurance: boolean"
)

code = code.replace(
    "updatedEnemies: CombatEnemy[] }",
    "updatedEnemies: CombatEnemy[], usedRelentlessEndurance: boolean }"
)

enemyAttackLogic = """    // Execute Intent
    if (enemy.intent === "attack" || enemy.intent === "heavy_attack") {
      let dmg = enemy.intentDamage || rollDie(6);
      
      // Gnome Cunning
      if (RACES[playerRace]?.trait.id === "gnome_cunning" && dmg > 5 && rollDie(100) <= 25) {
        dmg = 0;
        logEntries.push(`✨ Technomagický štít tě ochránil před mocným útokem od **${enemy.name}**!`);
      }
      
      // Dwarven Toughness (Damage reduction)
      if (RACES[playerRace]?.trait.id === "dwarven_toughness") {
        dmg = Math.max(0, dmg - 1);
      }
      
      currentHp -= dmg;
      logEntries.push(`⚔️ **${enemy.name}** zaútočil a udělil ti **${dmg} poškození**!`);
      
      // Tiefling Hellish Rebuke (Thorns)
      if (RACES[playerRace]?.trait.id === "hellish_rebuke" && dmg > 0) {
        enemy.hp -= 2;
        logEntries.push(`🔥 Pekelná odplata! **${enemy.name}** utržil 2 poškození z tvé krve.`);
      }
      
    } else if (enemy.intent === "defend") {"""

code = re.sub(
    r"    \/\/ Execute Intent[\s\S]*?} else if \(enemy\.intent === \"defend\"\) {",
    enemyAttackLogic,
    code
)

code = code.replace(
    "return { updatedPlayerHp: currentHp, logEntries, updatedEnemies };",
    """  if (currentHp <= 0 && RACES[playerRace]?.trait.id === "relentless_endurance" && !usedRelentlessEndurance) {
    currentHp = 1;
    usedRelentlessEndurance = true;
    logEntries.push("🛡️ Nezdolná vytrvalost! Odmítl jsi padnout a zůstáváš na 1 HP.");
  }
  
  return { updatedPlayerHp: currentHp, logEntries, updatedEnemies, usedRelentlessEndurance };"""
)

with open(path, "w", encoding="utf-8") as f:
    f.write(code)

print("Patched combatEngine.ts!")

