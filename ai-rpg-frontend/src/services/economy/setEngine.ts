/**
 * Gear Set Engine for Aelthgard RPG
 * Computes active set bonuses, stat enhancements, and unlocks passive perks
 */

import { CANONICAL_SETS, SetDefinition, SetBonus } from '@/data/canonicalLoot';

export interface ActiveSetInfo {
  setDef: SetDefinition;
  equippedCount: number;
  activeBonuses: SetBonus[];
  nextBonus: SetBonus | null;
}

export interface SetCalculatedStats {
  defenseBonus: number;
  attackBonus: number;
  maxHpBonus: number;
  spellSlotBonus: number;
  critBonusPercent: number;
  passivePerks: string[];
  activeSets: ActiveSetInfo[];
}

export function calculateSetBonuses(equippedItems: any[]): SetCalculatedStats {
  const result: SetCalculatedStats = {
    defenseBonus: 0,
    attackBonus: 0,
    maxHpBonus: 0,
    spellSlotBonus: 0,
    critBonusPercent: 0,
    passivePerks: [],
    activeSets: []
  };

  if (!equippedItems || !Array.isArray(equippedItems) || equippedItems.length === 0) {
    return result;
  }

  // 1. Count equipped pieces per setId
  const counts: Record<string, number> = {};
  for (const item of equippedItems) {
    if (item && item.setId && CANONICAL_SETS[item.setId]) {
      counts[item.setId] = (counts[item.setId] || 0) + 1;
    }
  }

  // 2. Evaluate bonuses for each set
  for (const [setId, count] of Object.entries(counts)) {
    const setDef = CANONICAL_SETS[setId];
    if (!setDef) continue;

    const activeBonuses = setDef.bonuses.filter(b => count >= b.count);
    const nextBonus = setDef.bonuses.find(b => count < b.count) || null;

    result.activeSets.push({
      setDef,
      equippedCount: count,
      activeBonuses,
      nextBonus
    });

    for (const bonus of activeBonuses) {
      if (bonus.defenseBonus) result.defenseBonus += bonus.defenseBonus;
      if (bonus.attackBonus) result.attackBonus += bonus.attackBonus;
      if (bonus.maxHpBonus) result.maxHpBonus += bonus.maxHpBonus;
      if (bonus.spellSlotBonus) result.spellSlotBonus += bonus.spellSlotBonus;
      if (bonus.critBonusPercent) result.critBonusPercent += bonus.critBonusPercent;
      if (bonus.passivePerk) result.passivePerks.push(bonus.passivePerk);
    }
  }

  return result;
}
