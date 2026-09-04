import { RACES, StatKey } from "../data/races";
import { CLASSES } from "../data/classes";

// Helper to calculate base stats + racial bonuses without mutating state
export const calculateBaseStats = (className: string, raceName: string): Record<StatKey, number> => {
  const classData = CLASSES[className];
  const raceData = RACES[raceName];

  // Default fallback if something is missing
  const base: Record<StatKey, number> = classData ? { ...classData.baseStats } : { str: 10, dex: 10, con: 10, intel: 10, wis: 10, cha: 10 };

  if (raceData && raceData.bonuses) {
    (Object.keys(raceData.bonuses) as StatKey[]).forEach(stat => {
      if (base[stat] !== undefined && raceData.bonuses[stat]) {
        base[stat] += raceData.bonuses[stat]!;
      }
    });
  }

  return base;
};

// Compute AC and derived combat stats centrally
export const calculateCombatStats = (character: any, inventory: any[]) => {
  let baseAC = 10;
  
  // Calculate Dex Modifier
  const dex = character.stats?.dex ?? 10;
  const dexMod = Math.floor((dex - 10) / 2);
  
  // Base AC is 10 + Dex mod for unarmored
  let finalAC = baseAC + dexMod;

  // Search inventory for equipped armor/shield (Currently we rely on names having +X AC, but a robust system checks item types. For now we parse.)
  const acMatches = inventory.map(item => {
    const match = item.match(/\(\+(\d+)\s*AC\)/i);
    return match ? parseInt(match[1]) : 0;
  });

  const totalItemAC = acMatches.reduce((a, b) => a + b, 0);
  finalAC += totalItemAC;

  // Apply Racial Passive AC
  const raceData = RACES[character.race];
  if (raceData && raceData.trait.id === "elven_agility") {
    finalAC += 1;
  }

  return {
    ac: finalAC
  };
};

