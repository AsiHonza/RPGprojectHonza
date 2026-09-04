import { useGameStore } from "../../store/gameStore";
import { RACES } from "../../data/races";

export interface CombatEnemy {
  id: string | number;
  name: string;
  hp: number;
  max_hp: number;
  ac: number;
  intent: "attack" | "defend" | "heavy_attack" | "flee" | "idle";
  intentDamage?: number;
  status?: "bleeding" | "stunned" | "burning" | "none";
}

// Helper: Roll a die
export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

// Helper: Parse damage dice like "1d8" or "2d6"
export function rollDamage(diceStr: string): number {
  if (diceStr === "0") return 0;
  const match = diceStr.match(/(\d+)d(\d+)/i);
  if (!match) return parseInt(diceStr) || 0;
  
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += rollDie(sides);
  }
  return total;
}

// Generate an intent for an enemy
export function generateEnemyIntent(enemy: CombatEnemy): CombatEnemy {
  // If stunned, intent is idle
  if (enemy.status === "stunned") {
    return { ...enemy, intent: "idle", intentDamage: 0 };
  }

  const roll = rollDie(100);
  let intent = enemy.intent;
  let intentDamage = enemy.intentDamage;

  if (roll <= 60) {
    intent = "attack";
    intentDamage = rollDie(6) + 1; // 2-7 dmg
  } else if (roll <= 80) {
    intent = "heavy_attack";
    intentDamage = rollDie(8) + 3; // 4-11 dmg
  } else if (roll <= 95) {
    intent = "defend";
    intentDamage = 0;
  } else {
    intent = "idle";
    intentDamage = 0;
  }

  return { ...enemy, intent, intentDamage };
}

// Player attacks an enemy
export function executePlayerAttack(
  skill: any, 
  targetId: string | number, 
  enemies: CombatEnemy[],
  playerStats: any,
  playerRace: string
): { updatedEnemies: CombatEnemy[], logEntry: string, hit: boolean } {
  
  let targetIndex = enemies.findIndex(e => e.id === targetId);
  if (targetIndex === -1) return { updatedEnemies: enemies, logEntry: "Cíl nenalezen.", hit: false };
  
  let enemy = { ...enemies[targetIndex] };
  let logEntry = "";
  let hit = false;
  
  let d20 = rollDie(20);
  if (d20 === 1 && RACES[playerRace]?.trait.id === "halfling_luck") {
    d20 = rollDie(20);
    logEntry += "🍀 Půlčíkovo štěstí tě zachránilo před kritickým neúspěchem! ";
  }
  
  // Rough modifier calculation
  const modifier = Math.floor(((playerStats.str || 10) - 10) / 2);
  const attackRoll = d20 + modifier;
  const targetAc = enemy.intent === "defend" ? enemy.ac + 2 : enemy.ac;

  if (skill.type === "defense") {
    logEntry = `🛡️ Použil jsi ${skill.name}. Tvoje obrana se zvýšila!`;
    hit = true;
    // Defense buff handled in UI state or a player status object
  } else {
    if (attackRoll >= targetAc || d20 === 20) {
      // Hit!
      const damage = rollDamage(skill.damageDice) + skill.damageBonus + modifier;
      enemy.hp -= damage;
      hit = true;
      logEntry = `⚔️ Trefa! ${skill.name} zasáhl cíl **${enemy.name}** za **${damage} dmg**!`;
      
      if (skill.effect === "stun" && rollDie(100) > 50) {
        enemy.status = "stunned";
        enemy.intent = "idle";
        logEntry += ` Cíl je **omráčen**!`;
      }
      if (skill.effect === "bleed") {
        enemy.status = "bleeding";
        logEntry += ` Cíl krvácí.`;
      }
    } else {
      // Miss
      logEntry = `💨 Minul jsi! Tvá zbraň cíl ${enemy.name} vůbec neškrábla (Hod: ${attackRoll} vs AC ${targetAc}).`;
    }
  }

  const updatedEnemies = [...enemies];
  updatedEnemies[targetIndex] = enemy;

  // Handle Cleave
  if (skill.effect === "cleave" && updatedEnemies.length > 1) {
    let nextTargetIndex = targetIndex === 0 ? 1 : 0;
    if (updatedEnemies[nextTargetIndex].hp > 0) {
      const cleaveDamage = rollDamage(skill.damageDice);
      updatedEnemies[nextTargetIndex].hp -= cleaveDamage;
      logEntry += `\n🌪️ Útok zasáhl i vedlejší cíl **${updatedEnemies[nextTargetIndex].name}** za **${cleaveDamage} dmg**!`;
    }
  }

  return { updatedEnemies, logEntry, hit };
}

// Execute Enemy Turn
export function executeEnemyTurn(
  enemies: CombatEnemy[],
  playerHp: number,
  playerRace: string,
  usedRelentlessEndurance: boolean
): { updatedPlayerHp: number, logEntries: string[], updatedEnemies: CombatEnemy[], usedRelentlessEndurance: boolean } {
  let currentHp = playerHp;
  let logEntries: string[] = [];
  let updatedEnemies = enemies.map(e => ({...e}));

  updatedEnemies.forEach(enemy => {
    if (enemy.hp <= 0) return;

    // Handle statuses
    if (enemy.status === "bleeding") {
      enemy.hp -= 2;
      logEntries.push(`🩸 **${enemy.name}** ztratil 2 HP krvácením.`);
      if (enemy.hp <= 0) {
        logEntries.push(`💀 **${enemy.name}** vykrvácel a zemřel!`);
        return; // skip action
      }
    }

    if (enemy.status === "stunned") {
      logEntries.push(`💫 **${enemy.name}** je omráčen a nemůže jednat!`);
      enemy.status = "none"; // clear stun for next round
      return;
    }

    // Execute Intent
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
    } else if (enemy.intent === "defend") {
      logEntries.push(`🛡️ **${enemy.name}** se drží v obraně.`);
    }

    // Generate next intent
    Object.assign(enemy, generateEnemyIntent(enemy));
  });

  // Half-Orc Relentless Endurance
  if (currentHp <= 0 && RACES[playerRace]?.trait.id === "relentless_endurance" && !usedRelentlessEndurance) {
    currentHp = 1;
    usedRelentlessEndurance = true;
    logEntries.push("🛡️ Nezdolná vytrvalost! Odmítl jsi padnout a zůstáváš na 1 HP.");
  }

  return { updatedPlayerHp: currentHp, logEntries, updatedEnemies, usedRelentlessEndurance };
}
