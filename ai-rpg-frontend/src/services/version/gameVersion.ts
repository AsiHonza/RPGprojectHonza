/**
 * Aethelgard Version & Compatibility Service
 */

export const CURRENT_GAME_VERSION = "2.1.0";

/**
 * Compares two semantic version strings (e.g. "2.1.0" vs "1.5.0").
 * Returns:
 *   -1 if v1 < v2
 *    0 if v1 == v2
 *    1 if v1 > v2
 */
export function compareVersions(v1?: string, v2?: string): number {
  if (!v1 && !v2) return 0;
  if (!v1) return -1;
  if (!v2) return 1;

  const parts1 = v1.replace(/^v/, '').split('.').map(Number);
  const parts2 = v2.replace(/^v/, '').split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}

/**
 * Checks if a character was created in a legacy version of Aethelgard
 * (before the v2.1 overhaul including Hex Map, Town Services, and Soul Engine).
 */
export function isLegacyCharacter(char: any): boolean {
  if (!char) return false;
  const state = char.state || {};

  // If explicit version is specified, compare against 2.1.0
  if (state.version) {
    return compareVersions(state.version, CURRENT_GAME_VERSION) < 0;
  }

  // Older characters lack world_data or hex_grid
  if (!state.world_data || !state.world_data.hex_grid || !Array.isArray(state.world_data.hex_grid) || state.world_data.hex_grid.length === 0) {
    return true;
  }

  return false;
}

/**
 * Returns whether the player has acknowledged the legacy warning for a specific character.
 */
export function isLegacyAcknowledged(characterName: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`aethelgard_ack_legacy_${characterName}`) === 'true';
}

/**
 * Sets acknowledgement for a specific legacy character so the warning doesn't repeatedly annoy the player.
 */
export function setLegacyAcknowledged(characterName: string, acknowledged: boolean): void {
  if (typeof window === 'undefined') return;
  if (acknowledged) {
    localStorage.setItem(`aethelgard_ack_legacy_${characterName}`, 'true');
  } else {
    localStorage.removeItem(`aethelgard_ack_legacy_${characterName}`);
  }
}
