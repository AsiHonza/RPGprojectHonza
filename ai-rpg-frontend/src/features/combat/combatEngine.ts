import { useGameStore } from "../../store/gameStore";
import { RACES } from "../../data/races";
import { StatusEffectType, ClassSkill, SkillRankData } from "../../data/classSkillTrees";

export interface ActiveStatusEffect {
  type: StatusEffectType;
  duration: number; // Zbývající počet kol
  damagePerRound?: number;
  name: string;
  icon: string;
}

export interface CombatEnemy {
  id: string | number;
  name: string;
  hp: number;
  max_hp: number;
  ac: number;
  intent: "attack" | "defend" | "heavy_attack" | "flee" | "idle";
  intentDamage?: number;
  status?: "bleeding" | "stunned" | "burning" | "none"; // Zpětná kompatibilita
  activeStatuses?: ActiveStatusEffect[];
}

// Helper: Roll a die
export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

// Helper: Parse damage dice like "1d8" or "2d6"
export function rollDamage(diceStr: string): number {
  if (!diceStr || diceStr === "0") return 0;
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

// Aplikace status efektu s pravidlem obnovení trvání (Refresh Duration)
export function applyStatusEffect(
  existingStatuses: ActiveStatusEffect[] = [],
  effectType: StatusEffectType,
  duration: number,
  damagePerRound: number = 3
): ActiveStatusEffect[] {
  const meta: Record<StatusEffectType, { name: string; icon: string }> = {
    burning: { name: "Hoření", icon: "🔥" },
    bleeding: { name: "Krvácení", icon: "🩸" },
    poisoned: { name: "Otrava", icon: "🧪" },
    frozen: { name: "Zchlazení", icon: "❄️" },
    stunned: { name: "Omráčení", icon: "💫" },
    shielded: { name: "Štít", icon: "🛡️" }
  };

  const info = meta[effectType] || { name: effectType, icon: "⚡" };
  const list = [...existingStatuses];
  const idx = list.findIndex(s => s.type === effectType);

  if (idx !== -1) {
    // Obnovení trvání na maximum
    list[idx] = {
      ...list[idx],
      duration: Math.max(list[idx].duration, duration),
      damagePerRound: Math.max(list[idx].damagePerRound || 0, damagePerRound)
    };
  } else {
    list.push({
      type: effectType,
      duration,
      damagePerRound,
      name: info.name,
      icon: info.icon
    });
  }

  return list;
}

// Vyhodnocení DoT na začátku tahu nepřítele
export function tickEnemyStatuses(enemy: CombatEnemy): { updatedEnemy: CombatEnemy; logEntries: string[]; diedFromDot: boolean } {
  let updated = { ...enemy, activeStatuses: enemy.activeStatuses ? [...enemy.activeStatuses] : [] };
  let logEntries: string[] = [];
  let diedFromDot = false;

  if (!updated.activeStatuses || updated.activeStatuses.length === 0) {
    return { updatedEnemy: updated, logEntries, diedFromDot };
  }

  const nextStatuses: ActiveStatusEffect[] = [];

  for (const st of updated.activeStatuses) {
    if (st.type === "burning" && st.damagePerRound) {
      updated.hp -= st.damagePerRound;
      logEntries.push(`🔥 **${updated.name}** uhořel za ${st.damagePerRound} dmg (zbývá ${st.duration - 1} kol).`);
    } else if (st.type === "bleeding" && st.damagePerRound) {
      updated.hp -= st.damagePerRound;
      logEntries.push(`🩸 **${updated.name}** krvácí za ${st.damagePerRound} dmg (zbývá ${st.duration - 1} kol).`);
    } else if (st.type === "poisoned" && st.damagePerRound) {
      updated.hp -= st.damagePerRound;
      logEntries.push(`🧪 **${updated.name}** trpí otravou za ${st.damagePerRound} dmg (zbývá ${st.duration - 1} kol).`);
    } else if (st.type === "stunned") {
      logEntries.push(`💫 **${updated.name}** je omráčen a vynechává kolo!`);
      updated.intent = "idle";
      updated.intentDamage = 0;
    }

    if (updated.hp <= 0) {
      diedFromDot = true;
      logEntries.push(`💀 **${updated.name}** podlehl zraněním a zemřel!`);
      break;
    }

    // Dekrementovat počet kol
    if (st.duration > 1) {
      nextStatuses.push({ ...st, duration: st.duration - 1 });
    }
  }

  updated.activeStatuses = nextStatuses;
  return { updatedEnemy: updated, logEntries, diedFromDot };
}

// Vyhodnocení DoT na začátku tahu hráče (s respektováním odolností)
export function tickPlayerStatuses(
  playerHp: number,
  playerStatuses: ActiveStatusEffect[] = [],
  resistances: { fire?: number; cold?: number; poison?: number; bleed?: number } = {},
  flatReduction: number = 0
): { updatedPlayerHp: number; updatedStatuses: ActiveStatusEffect[]; logEntries: string[] } {
  let currentHp = playerHp;
  let logEntries: string[] = [];
  let nextStatuses: ActiveStatusEffect[] = [];

  for (const st of playerStatuses) {
    let baseDmg = st.damagePerRound || 0;
    if (baseDmg > 0) {
      if (st.type === "burning" && resistances.fire) {
        baseDmg = Math.max(1, Math.round(baseDmg * (1 - Math.min(0.75, resistances.fire))));
      } else if (st.type === "bleeding" && resistances.bleed) {
        baseDmg = Math.max(1, Math.round(baseDmg * (1 - Math.min(0.75, resistances.bleed))));
      } else if (st.type === "poisoned" && resistances.poison) {
        baseDmg = Math.max(1, Math.round(baseDmg * (1 - Math.min(0.75, resistances.poison))));
      }

      baseDmg = Math.max(1, baseDmg - flatReduction);
      currentHp -= baseDmg;

      const icon = st.type === 'burning' ? '🔥' : (st.type === 'bleeding' ? '🩸' : '🧪');
      logEntries.push(`${icon} Trpíš efektem ${st.name}: ztratil jsi ${baseDmg} HP! (Zbývá ${st.duration - 1} kol).`);
    }

    if (st.duration > 1) {
      nextStatuses.push({ ...st, duration: st.duration - 1 });
    }
  }

  return { updatedPlayerHp: currentHp, updatedStatuses: nextStatuses, logEntries };
}

// Generate an intent for an enemy
export function generateEnemyIntent(enemy: CombatEnemy): CombatEnemy {
  const hasStun = enemy.activeStatuses?.some(s => s.type === "stunned") || enemy.status === "stunned";
  if (hasStun) {
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

// Player attacks an enemy with equipped weapon
export function executePlayerAttack(
  skill: any, 
  targetId: string | number, 
  enemies: CombatEnemy[],
  playerStats: any,
  playerRace: string,
  weaponAffliction?: any
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
  
  const modifier = Math.floor(((playerStats.str || 10) - 10) / 2);
  const attackRoll = d20 + modifier;
  const targetAc = enemy.intent === "defend" ? enemy.ac + 2 : enemy.ac;

  if (skill.type === "defense") {
    logEntry = `🛡️ Použil jsi ${skill.name}. Tvoje obrana se zvýšila!`;
    hit = true;
  } else {
    if (attackRoll >= targetAc || d20 === 20) {
      const damage = rollDamage(skill.damageDice) + (skill.damageBonus || 0) + modifier;
      enemy.hp -= damage;
      hit = true;
      logEntry = `⚔️ Trefa! ${skill.name} zasáhl cíl **${enemy.name}** za **${damage} dmg**!`;
      
      // Basic weapon effect
      if (skill.effect === "stun" && rollDie(100) > 50) {
        enemy.activeStatuses = applyStatusEffect(enemy.activeStatuses, "stunned", 1);
        enemy.intent = "idle";
        logEntry += ` Cíl je **omráčen**!`;
      }
      if (skill.effect === "bleed") {
        enemy.activeStatuses = applyStatusEffect(enemy.activeStatuses, "bleeding", 2, 3);
        logEntry += ` Cíl krvácí.`;
      }

      // Weapon status affliction (z chytrého generátoru předmětů)
      if (weaponAffliction && Math.random() <= (weaponAffliction.chance || 0.4)) {
        enemy.activeStatuses = applyStatusEffect(
          enemy.activeStatuses,
          weaponAffliction.type,
          weaponAffliction.duration || 2,
          weaponAffliction.damagePerRound || 4
        );
        const symbol = weaponAffliction.type === 'burning' ? '🔥 Hoří' : (weaponAffliction.type === 'poisoned' ? '🧪 Otráven' : '🩸 Krvácí');
        logEntry += ` ${symbol} zásahem zbraně!`;
      }
    } else {
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

// Execute Player Class Skill (Single, AoE, or Self)
export function executePlayerClassSkill(
  skill: ClassSkill,
  rankData: SkillRankData,
  targetId: string | number | null,
  enemies: CombatEnemy[],
  playerStats: any,
  playerHp: number,
  maxHp: number,
  playerClass: string
): { 
  updatedEnemies: CombatEnemy[]; 
  updatedPlayerHp: number; 
  addedShield: number;
  logEntries: string[]; 
  isAoE: boolean;
} {
  let updatedEnemies = enemies.map(e => ({ ...e, activeStatuses: e.activeStatuses ? [...e.activeStatuses] : [] }));
  let currentHp = playerHp;
  let addedShield = 0;
  let logEntries: string[] = [];
  const isAoE = skill.targetType === "aoe";

  // Primární modifikátor podle třídy
  let statMod = 0;
  const p = (statKey: string) => Math.floor(((playerStats[statKey] || 10) - 10) / 2);
  if (["Barbar", "Bojovník", "Paladin"].includes(playerClass)) statMod = p("str");
  else if (["Tulák", "Mnich", "Hraničář"].includes(playerClass)) statMod = p("dex");
  else if (["Kouzelník"].includes(playerClass)) statMod = p("intel");
  else if (["Klerik", "Druid"].includes(playerClass)) statMod = p("wis");
  else statMod = p("cha"); // Bard, Čaroděj, Černokněžník

  // 1. SELF SKILL (Léčení, štít, buff)
  if (skill.targetType === "self") {
    if (rankData.healAmount) {
      const heal = rankData.healAmount + Math.max(0, statMod);
      currentHp = Math.min(maxHp, currentHp + heal);
      logEntries.push(`✨ **${skill.name}**: Vyléčil jsi se za **${heal} HP**! (Aktuální HP: ${currentHp}/${maxHp})`);
    }
    if (rankData.shieldAmount) {
      addedShield = rankData.shieldAmount;
      logEntries.push(`🛡️ **${skill.name}**: Získal jsi ochrannou bariéru na **${addedShield} HP**!`);
    }
    return { updatedEnemies, updatedPlayerHp: currentHp, addedShield, logEntries, isAoE: false };
  }

  // 2. AOE SKILL (Zasáhne všechny živé nepřátele)
  if (skill.targetType === "aoe") {
    let hitCount = 0;
    let totalDmg = 0;

    updatedEnemies.forEach(enemy => {
      if (enemy.hp <= 0) return;
      hitCount++;

      let dmg = rollDamage(rankData.damageDice || "1d6") + (rankData.damageBonus || 0) + Math.max(1, statMod);
      enemy.hp -= dmg;
      totalDmg += dmg;

      let extraText = "";
      if (rankData.statusEffect) {
        enemy.activeStatuses = applyStatusEffect(
          enemy.activeStatuses,
          rankData.statusEffect.type,
          rankData.statusEffect.duration,
          rankData.statusEffect.damagePerRound || 4
        );
        extraText = ` [${rankData.statusEffect.type}]`;
      }

      if (enemy.hp <= 0) {
        extraText += " 💀 (Zabit!)";
      }

      logEntries.push(`💥 **${skill.name}** zasáhl **${enemy.name}** za **${dmg} dmg**!${extraText}`);
    });

    if (rankData.healAmount) {
      currentHp = Math.min(maxHp, currentHp + rankData.healAmount);
      logEntries.push(`✨ Z plošného kouzla jsi se vyléčil za ${rankData.healAmount} HP!`);
    }

    return { updatedEnemies, updatedPlayerHp: currentHp, addedShield, logEntries, isAoE: true };
  }

  // 3. SINGLE TARGET SKILL
  let targetIdx = updatedEnemies.findIndex(e => e.id === targetId);
  if (targetIdx === -1) {
    targetIdx = updatedEnemies.findIndex(e => e.hp > 0);
  }

  if (targetIdx !== -1) {
    let enemy = updatedEnemies[targetIdx];
    let dmg = rollDamage(rankData.damageDice || "1d8") + (rankData.damageBonus || 0) + Math.max(1, statMod);
    enemy.hp -= dmg;

    let extraText = "";
    if (rankData.statusEffect) {
      enemy.activeStatuses = applyStatusEffect(
        enemy.activeStatuses,
        rankData.statusEffect.type,
        rankData.statusEffect.duration,
        rankData.statusEffect.damagePerRound || 4
      );
      extraText = ` a udělil efekt ${rankData.statusEffect.type}!`;
    }

    if (enemy.hp <= 0) {
      extraText += " 💀 Cíl padl k zemi mrtev!";
    }

    logEntries.push(`⚡ **${skill.name}** zasáhl cíl **${enemy.name}** za **${dmg} dmg**!${extraText}`);
    updatedEnemies[targetIdx] = enemy;
  }

  return { updatedEnemies, updatedPlayerHp: currentHp, addedShield, logEntries, isAoE: false };
}

// Execute Enemy Turn
export function executeEnemyTurn(
  enemies: CombatEnemy[],
  playerHp: number,
  playerRace: string,
  usedRelentlessEndurance: boolean,
  playerShield: number = 0,
  flatReduction: number = 0
): { 
  updatedPlayerHp: number; 
  updatedShield: number;
  logEntries: string[]; 
  updatedEnemies: CombatEnemy[]; 
  usedRelentlessEndurance: boolean 
} {
  let currentHp = playerHp;
  let currentShield = playerShield;
  let logEntries: string[] = [];
  let updatedEnemies = enemies.map(e => ({
    ...e,
    activeStatuses: e.activeStatuses ? [...e.activeStatuses] : []
  }));

  updatedEnemies.forEach(enemy => {
    if (enemy.hp <= 0) return;

    // 1. Zpracování DoT na začátku tahu nepřítele
    const dotResult = tickEnemyStatuses(enemy);
    Object.assign(enemy, dotResult.updatedEnemy);
    if (dotResult.logEntries.length > 0) {
      logEntries.push(...dotResult.logEntries);
    }

    if (enemy.hp <= 0) {
      return; // Nepřítel uhořel/vykrvácel na začátku tahu – neútočí!
    }

    // 2. Kontrola Omráčení
    const isStunned = enemy.activeStatuses?.some(s => s.type === "stunned") || enemy.status === "stunned";
    if (isStunned) {
      logEntries.push(`💫 **${enemy.name}** je omráčen a vynechává kolo!`);
      // Vyčistit omráčení
      enemy.activeStatuses = (enemy.activeStatuses || []).filter(s => s.type !== "stunned");
      enemy.status = "none";
      Object.assign(enemy, generateEnemyIntent(enemy));
      return;
    }

    // 3. Provedení Intentu
    if (enemy.intent === "attack" || enemy.intent === "heavy_attack") {
      let dmg = enemy.intentDamage || rollDie(6);
      
      // Gnome Cunning
      if (RACES[playerRace]?.trait.id === "gnome_cunning" && dmg > 5 && rollDie(100) <= 25) {
        dmg = 0;
        logEntries.push(`✨ Technomagický štít tě ochránil před útokem od **${enemy.name}**!`);
      }
      
      // Plochá redukce zbroje
      dmg = Math.max(1, dmg - flatReduction);

      // Absorpce štítem
      if (currentShield > 0) {
        if (currentShield >= dmg) {
          currentShield -= dmg;
          logEntries.push(`🛡️ Tvůj magický štít zcela absorboval útok od **${enemy.name}** (${dmg} dmg absorbed, zbývá ${currentShield} štít).`);
          dmg = 0;
        } else {
          dmg -= currentShield;
          logEntries.push(`🛡️ Tvůj štít absorboval ${currentShield} zranění a praskl!`);
          currentShield = 0;
        }
      }

      if (dmg > 0) {
        currentHp -= dmg;
        logEntries.push(`⚔️ **${enemy.name}** zaútočil a udělil ti **${dmg} poškození**!`);
      }
      
      // Tiefling Hellish Rebuke (Thorns)
      if (RACES[playerRace]?.trait.id === "hellish_rebuke" && dmg > 0) {
        enemy.hp -= 2;
        logEntries.push(`🔥 Pekelná odplata! **${enemy.name}** utržil 2 poškození z tvé krve.`);
      }
    } else if (enemy.intent === "defend") {
      logEntries.push(`🛡️ **${enemy.name}** se drží v pevném obranném postoji.`);
    }

    // Vygenerovat další intent
    Object.assign(enemy, generateEnemyIntent(enemy));
  });

  // Half-Orc Relentless Endurance
  if (currentHp <= 0 && RACES[playerRace]?.trait.id === "relentless_endurance" && !usedRelentlessEndurance) {
    currentHp = 1;
    usedRelentlessEndurance = true;
    logEntries.push("🛡️ Nezdolná vytrvalost! Odmítl jsi padnout a zůstáváš na 1 HP.");
  }

  return { updatedPlayerHp: currentHp, updatedShield: currentShield, logEntries, updatedEnemies, usedRelentlessEndurance };
}
