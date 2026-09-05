// Deterministický Smart Loot Engine podle D&D taxonomie
import { 
  ItemDef, ItemRarity, ItemType, EquipSlot,
  CLASS_PROFICIENCIES, CLASS_ARTIFACTS, 
  BASE_WEAPON_TEMPLATES, BASE_ARMOR_TEMPLATES, BASE_ACCESSORY_TEMPLATES 
} from '../data/itemsCatalog';
import { StatusEffectType } from '../data/classSkillTrees';

const ALL_CLASSES = [
  "Barbar", "Bard", "Klerik", "Druid", "Bojovník", "Mnich", 
  "Paladin", "Hraničář", "Tulák", "Čaroděj", "Černokněžník", "Kouzelník"
];

export function generateSmartLoot(
  playerLevel: number, 
  playerClass: string, 
  source: 'monster' | 'chest' | 'boss' | 'quest' = 'monster'
): ItemDef {
  // 1. Určení třídy předmětu (80 % pro hráče, 20 % jiná třída pro prodej)
  const isForPlayerClass = Math.random() < 0.8;
  let targetClass = playerClass;
  if (!isForPlayerClass) {
    const otherClasses = ALL_CLASSES.filter(c => c !== playerClass);
    targetClass = otherClasses[Math.floor(Math.random() * otherClasses.length)] || playerClass;
  }

  // 2. Určení rarity podle úrovně a zdroje
  let rarity: ItemRarity = 'common';
  const roll = Math.random() * 100;

  if (source === 'boss') {
    if (playerLevel >= 6 && roll < 30) rarity = 'legendary';
    else if (playerLevel >= 4 && roll < 70) rarity = 'epic';
    else rarity = 'rare';
  } else if (source === 'quest') {
    if (playerLevel >= 7 && roll < 20) rarity = 'legendary';
    else if (playerLevel >= 4 && roll < 50) rarity = 'epic';
    else if (roll < 85) rarity = 'rare';
    else rarity = 'uncommon';
  } else {
    // Standardní monster / chest
    if (playerLevel <= 3) {
      if (roll < 70) rarity = 'common';
      else if (roll < 95) rarity = 'uncommon';
      else rarity = 'rare';
    } else if (playerLevel <= 6) {
      if (roll < 30) rarity = 'common';
      else if (roll < 75) rarity = 'uncommon';
      else if (roll < 95) rarity = 'rare';
      else rarity = 'epic';
    } else {
      // Level 7+
      if (roll < 10) rarity = 'common';
      else if (roll < 40) rarity = 'uncommon';
      else if (roll < 80) rarity = 'rare';
      else if (roll < 95) rarity = 'epic';
      else rarity = 'legendary';
    }
  }

  // 3. Pokud padla Epická nebo Legendární rarita, použijeme ručně navržený artefakt!
  if (rarity === 'legendary' || rarity === 'epic') {
    const classArtifacts = CLASS_ARTIFACTS[targetClass] || [];
    const matchingArtifacts = classArtifacts.filter(a => a.rarity === rarity);
    const pool = matchingArtifacts.length > 0 ? matchingArtifacts : classArtifacts;
    
    if (pool.length > 0) {
      const selectedArtifact = pool[Math.floor(Math.random() * pool.length)];
      return {
        ...selectedArtifact,
        id: `loot_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
      };
    }
  }

  // 4. Pro Common, Uncommon a Rare generujeme vyvážený předmět
  const typeRoll = Math.random();
  let itemCategory: 'weapon' | 'armor' | 'accessory' = 'weapon';
  if (typeRoll < 0.50) itemCategory = 'weapon';
  else if (typeRoll < 0.85) itemCategory = 'armor';
  else itemCategory = 'accessory';

  const proficiencies = CLASS_PROFICIENCIES[targetClass] || { weapons: ["jednoruční", "dýka"], armors: ["lehká"] };
  const uid = `loot_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  if (itemCategory === 'weapon') {
    // Vyber zbraň povolenou pro danou třídu
    const allowedKeys = Object.keys(BASE_WEAPON_TEMPLATES).filter(k => {
      const t = BASE_WEAPON_TEMPLATES[k];
      return proficiencies.weapons.some(w => t.weaponType.includes(w) || w.includes(t.weaponType));
    });
    const key = allowedKeys[Math.floor(Math.random() * allowedKeys.length)] || "dlouhy_mec";
    const base = BASE_WEAPON_TEMPLATES[key];

    let name = base.name;
    let attack_bonus = 0;
    let sell_price = 10;
    let statusAffliction: any = undefined;

    if (rarity === 'uncommon') {
      const prefixes = ["Kalený", "Vyvážený", "Ostrý", "Leštěný", "Kvalitní"];
      name = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${base.name.toLowerCase()}`;
      attack_bonus = 1;
      sell_price = 25;
      if (Math.random() < 0.3) {
        statusAffliction = { type: 'bleeding', chance: 0.25, duration: 2, damagePerRound: 3 };
      }
    } else if (rarity === 'rare') {
      const rareAffixes: Array<{ prefix: string; status: StatusEffectType; label: string }> = [
        { prefix: "Plamenný", status: "burning", label: "Hoření (40%)" },
        { prefix: "Mrazivý", status: "frozen", label: "Zchlazení (40%)" },
        { prefix: "Jedovatý", status: "poisoned", label: "Otrava (40%)" },
        { prefix: "Zubatý", status: "bleeding", label: "Krvácení (50%)" },
        { prefix: "Bleskový", status: "stunned", label: "Omráčení (25%)" }
      ];
      const affix = rareAffixes[Math.floor(Math.random() * rareAffixes.length)];
      name = `${affix.prefix} ${base.name.toLowerCase()}`;
      attack_bonus = 2;
      sell_price = 50;
      statusAffliction = { 
        type: affix.status, 
        chance: affix.status === 'stunned' ? 0.25 : 0.45, 
        duration: affix.status === 'stunned' ? 1 : 2, 
        damagePerRound: 4 
      };
    }

    return {
      id: uid,
      name,
      type: "zbraň",
      slot: base.slot,
      rarity,
      icon: base.icon,
      weaponType: base.weaponType,
      allowedClasses: [targetClass],
      attack_bonus,
      damageDice: base.dice,
      statusAffliction,
      sell_price,
      stats: `Útok +${attack_bonus}, ${base.dice} Dmg${statusAffliction ? `, Status: ${statusAffliction.type}` : ''}`
    };
  } else if (itemCategory === 'armor') {
    // Vyber zbroj povolenou pro danou třídu
    const allowedKeys = Object.keys(BASE_ARMOR_TEMPLATES).filter(k => {
      const t = BASE_ARMOR_TEMPLATES[k];
      return proficiencies.armors.some(a => t.armorType.includes(a) || a.includes(t.armorType));
    });
    const key = allowedKeys[Math.floor(Math.random() * allowedKeys.length)] || "lehka_kuze";
    const base = BASE_ARMOR_TEMPLATES[key];

    let name = base.name;
    let defense_bonus = base.ac;
    let sell_price = 12;
    let resistances: any = undefined;
    let flatDamageReduction = 0;

    if (rarity === 'uncommon') {
      const prefixes = ["Zpevněná", "Obrněná", "Mistrovská", "Vyztužená"];
      name = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${base.name.toLowerCase()}`;
      defense_bonus += 1;
      sell_price = 30;
      flatDamageReduction = 1;
    } else if (rarity === 'rare') {
      const rareArmorAffixes = [
        { prefix: "Dračí", res: { fire: 0.4 }, label: "Odolnost Oheň 40%" },
        { prefix: "Glaciální", res: { cold: 0.4 }, label: "Odolnost Led 40%" },
        { prefix: "Hadí", res: { poison: 0.5 }, label: "Odolnost Jed 50%" },
        { prefix: "Mithrilová", res: { bleed: 0.5 }, label: "Odolnost Krvácení 50%" }
      ];
      const affix = rareArmorAffixes[Math.floor(Math.random() * rareArmorAffixes.length)];
      name = `${affix.prefix} ${base.name.toLowerCase()}`;
      defense_bonus += 2;
      flatDamageReduction = 2;
      resistances = affix.res;
      sell_price = 60;
    }

    return {
      id: uid,
      name,
      type: base.armorType === 'štít' ? "štít" : "zbroj",
      slot: base.slot,
      rarity,
      icon: base.icon,
      armorType: base.armorType,
      allowedClasses: [targetClass],
      defense_bonus,
      flatDamageReduction: flatDamageReduction > 0 ? flatDamageReduction : undefined,
      resistances,
      sell_price,
      stats: `Obrana +${defense_bonus}${flatDamageReduction > 0 ? `, Redukce -${flatDamageReduction} dmg` : ''}`
    };
  } else {
    // Šperk (Prsten nebo Amulet)
    const keys = Object.keys(BASE_ACCESSORY_TEMPLATES);
    const key = keys[Math.floor(Math.random() * keys.length)];
    const base = BASE_ACCESSORY_TEMPLATES[key];

    let name = base.name;
    let sell_price = 20;
    let defense_bonus = 0;
    let attack_bonus = 0;
    let resistances: any = undefined;

    if (rarity === 'uncommon') {
      name = `Očarovaný ${base.name.toLowerCase()}`;
      defense_bonus = 1;
      sell_price = 40;
    } else if (rarity === 'rare') {
      name = `Prastarý ${base.name.toLowerCase()}`;
      defense_bonus = 1;
      attack_bonus = 1;
      resistances = { fire: 0.25, poison: 0.25 };
      sell_price = 75;
    }

    return {
      id: uid,
      name,
      type: "doplněk",
      slot: base.slot,
      rarity,
      icon: base.icon,
      allowedClasses: [targetClass],
      defense_bonus: defense_bonus > 0 ? defense_bonus : undefined,
      attack_bonus: attack_bonus > 0 ? attack_bonus : undefined,
      resistances,
      sell_price,
      stats: `${defense_bonus > 0 ? `Obrana +${defense_bonus} ` : ''}${attack_bonus > 0 ? `Útok +${attack_bonus}` : ''}`
    };
  }
}
