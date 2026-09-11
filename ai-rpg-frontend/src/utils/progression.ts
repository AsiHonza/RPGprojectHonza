/**
 * Progression Utility for Aelthgard RPG
 * Dynamic Rogue-lite XP scaling and level-up calculations
 */

export function getXpForNextLevel(level: number): number {
  if (level <= 1) return 150;
  if (level === 2) return 300;
  if (level === 3) return 500;
  if (level === 4) return 750;
  if (level === 5) return 1000;
  return 1000 + (level - 5) * 250;
}

export function getXpProgressPercent(xp: number, level: number): number {
  const needed = getXpForNextLevel(level);
  if (needed <= 0) return 100;
  return Math.min(100, Math.max(0, Math.floor((xp / needed) * 100)));
}

export function checkLevelUp(currentXp: number, currentLevel: number): {
  leveledUp: boolean;
  newLevel: number;
  remainingXp: number;
  xpNeeded: number;
} {
  const xpNeeded = getXpForNextLevel(currentLevel);
  if (currentXp >= xpNeeded) {
    return {
      leveledUp: true,
      newLevel: currentLevel + 1,
      remainingXp: currentXp - xpNeeded,
      xpNeeded
    };
  }
  return {
    leveledUp: false,
    newLevel: currentLevel,
    remainingXp: currentXp,
    xpNeeded
  };
}
