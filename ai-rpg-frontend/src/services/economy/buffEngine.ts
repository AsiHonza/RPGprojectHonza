export type BuffType = 
  | 'damage'        // +X flat physical damage
  | 'defense'       // +X Armor Class (AC)
  | 'tempHp'        // Temporary HP pool
  | 'attackBonus'   // +X to attack rolls (d20)
  | 'silvered'      // +50% damage against undead, ghosts and lycanthropes
  | 'blessing'      // Divine blessing: +1d4 to rolls or saving throws
  | 'wellRested';   // +10 max/temp HP for 1 day

export interface ActiveBuff {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: BuffType;
  value: number;
  durationBattles?: number; // Decays on victory in combat
  durationDays?: number;    // Decays on day change / long rest
  source?: 'blacksmith' | 'tavern' | 'temple' | 'potion' | 'other';
}

/**
 * Calculates total damage bonus provided by active buffs.
 */
export function getBuffDamageBonus(buffs: ActiveBuff[]): number {
  if (!Array.isArray(buffs)) return 0;
  let bonus = 0;
  for (const b of buffs) {
    if (b.type === 'damage') {
      bonus += b.value;
    }
  }
  return bonus;
}

/**
 * Calculates total AC / defense bonus provided by active buffs.
 */
export function getBuffDefenseBonus(buffs: ActiveBuff[]): number {
  if (!Array.isArray(buffs)) return 0;
  let bonus = 0;
  for (const b of buffs) {
    if (b.type === 'defense') {
      bonus += b.value;
    }
  }
  return bonus;
}

/**
 * Checks whether the player's weapon currently has the silvered property.
 */
export function hasSilveredBuff(buffs: ActiveBuff[]): boolean {
  if (!Array.isArray(buffs)) return false;
  return buffs.some(b => b.type === 'silvered' && (b.durationBattles === undefined || b.durationBattles > 0));
}

/**
 * Checks whether the player has an active divine blessing.
 */
export function getBlessingBonus(buffs: ActiveBuff[]): number {
  if (!Array.isArray(buffs)) return 0;
  const blessing = buffs.find(b => b.type === 'blessing');
  return blessing ? blessing.value : 0;
}
