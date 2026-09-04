export interface WeaponSkill {
  id: string;
  name: string;
  description: string;
  apCost: number;
  damageDice: string; // e.g. "1d8"
  damageBonus: number; // e.g. 2
  type: "melee" | "ranged" | "magic" | "defense" | "utility";
  icon: string; // EMOJI representation
  effect?: "stun" | "bleed" | "cleave" | "pierce" | "block";
}

// Maps weapon categories/keywords to available skills
export const WEAPON_SKILLS_DB: Record<string, WeaponSkill[]> = {
  "meč": [
    { id: "sword_slash", name: "Seknutí", description: "Základní útok mečem.", apCost: 1, damageDice: "1d8", damageBonus: 0, type: "melee", icon: "🗡️" },
    { id: "sword_cleave", name: "Rozmáchlý útok", description: "Zasáhne hlavní cíl a může zasáhnout i vedlejší. Stojí více energie.", apCost: 2, damageDice: "1d6", damageBonus: 0, type: "melee", icon: "🌪️", effect: "cleave" }
  ],
  "dýka": [
    { id: "dagger_stab", name: "Rychlý bod", description: "Základní útok dýkou.", apCost: 1, damageDice: "1d4", damageBonus: 0, type: "melee", icon: "🔪" },
    { id: "dagger_bleed", name: "Krvavá rána", description: "Způsobí krvácení cíle.", apCost: 2, damageDice: "1d4", damageBonus: 0, type: "melee", icon: "🩸", effect: "bleed" }
  ],
  "palcát": [
    { id: "mace_strike", name: "Úder", description: "Základní útok palcátem.", apCost: 1, damageDice: "1d6", damageBonus: 0, type: "melee", icon: "🔨" },
    { id: "mace_stun", name: "Drtivý úder", description: "Pokusí se omráčit cíl a přerušit jeho útok.", apCost: 2, damageDice: "1d6", damageBonus: 0, type: "melee", icon: "⚡", effect: "stun" }
  ],
  "kladivo": [
    { id: "hammer_strike", name: "Úder kladivem", description: "Základní útok válečným kladivem.", apCost: 1, damageDice: "1d8", damageBonus: 0, type: "melee", icon: "🔨" },
    { id: "hammer_stun", name: "Drtivý úder", description: "Pokusí se omráčit cíl a přerušit jeho útok.", apCost: 2, damageDice: "1d8", damageBonus: 0, type: "melee", icon: "⚡", effect: "stun" }
  ],
  "sekera": [
    { id: "axe_chop", name: "Seknutí", description: "Základní útok sekerou.", apCost: 1, damageDice: "1d8", damageBonus: 0, type: "melee", icon: "🪓" },
    { id: "axe_cleave", name: "Rozpůlení", description: "Ignoruje část zbroje cíle.", apCost: 2, damageDice: "1d8", damageBonus: 0, type: "melee", icon: "💥", effect: "pierce" }
  ],
  "hůl": [
    { id: "staff_strike", name: "Úder holí", description: "Základní útok holí.", apCost: 1, damageDice: "1d6", damageBonus: 0, type: "melee", icon: "🦯" },
    { id: "staff_block", name: "Krytí holí", description: "Zvýší obranu pro toto kolo.", apCost: 1, damageDice: "0", damageBonus: 0, type: "defense", icon: "🛡️", effect: "block" }
  ],
  "luk": [
    { id: "bow_shoot", name: "Výstřel", description: "Základní střelba z luku.", apCost: 1, damageDice: "1d8", damageBonus: 0, type: "ranged", icon: "🏹" },
    { id: "bow_pierce", name: "Průrazný šíp", description: "Šíp, který ignoruje část zbroje.", apCost: 2, damageDice: "1d8", damageBonus: 0, type: "ranged", icon: "🎯", effect: "pierce" }
  ],
  "hůlka": [
    { id: "wand_blast", name: "Magický výboj", description: "Základní útok hůlkou.", apCost: 1, damageDice: "1d6", damageBonus: 0, type: "magic", icon: "✨" },
    { id: "wand_focus", name: "Soustředěný paprsek", description: "Silný magický útok.", apCost: 2, damageDice: "1d10", damageBonus: 0, type: "magic", icon: "🔥", effect: "pierce" }
  ],
  "rapír": [
    { id: "rapier_thrust", name: "Výpad", description: "Základní útok rapírem.", apCost: 1, damageDice: "1d8", damageBonus: 0, type: "melee", icon: "🤺" },
    { id: "rapier_pierce", name: "Přesný bod", description: "Míří na slabé místo zbroje.", apCost: 2, damageDice: "1d8", damageBonus: 0, type: "melee", icon: "🎯", effect: "pierce" }
  ],
  "štít": [
    { id: "shield_block", name: "Zvednout štít", description: "Zablokuje část příchozího zranění nebo přeruší slabý útok.", apCost: 1, damageDice: "0", damageBonus: 0, type: "defense", icon: "🛡️", effect: "block" },
    { id: "shield_bash", name: "Úder štítem", description: "Může omráčit nepřítele.", apCost: 2, damageDice: "1d4", damageBonus: 0, type: "melee", icon: "💥", effect: "stun" }
  ]
};

export const DEFAULT_UNARMED_SKILLS: WeaponSkill[] = [
  { id: "unarmed_punch", name: "Úder pěstí", description: "Základní útok beze zbraně.", apCost: 1, damageDice: "1d4", damageBonus: 0, type: "melee", icon: "👊" }
];

// Helper to resolve skills based on weapon name
export function getSkillsForWeapon(weaponName: string | undefined): WeaponSkill[] {
  if (!weaponName) return DEFAULT_UNARMED_SKILLS;
  
  const lowerName = weaponName.toLowerCase();
  for (const [keyword, skills] of Object.entries(WEAPON_SKILLS_DB)) {
    if (lowerName.includes(keyword)) {
      return skills;
    }
  }
  
  // Fallback for unknown weapons
  return [
    { id: "generic_strike", name: "Útok zbraní", description: "Základní útok.", apCost: 1, damageDice: "1d6", damageBonus: 0, type: "melee", icon: "⚔️" }
  ];
}
