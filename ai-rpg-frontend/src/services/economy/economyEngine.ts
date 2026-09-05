import { ActiveBuff } from './buffEngine';

export interface MountDef {
  id: 'mule' | 'horse' | 'warhorse';
  name: string;
  icon: string;
  price: number;
  description: string;
  inventoryBonus: number;
  travelSpeedMultiplier: number; // 0.5 means takes half the time/rations
  combatPerk?: string;
}

export const MOUNTS_CATALOG: MountDef[] = [
  {
    id: 'mule',
    name: 'Tažný mezek',
    icon: '🫏',
    price: 60,
    description: 'Vytrvalé a skromné zvíře. Unese spoustu nákladu a rozšíří tvůj inventář o 12 dalších slotů.',
    inventoryBonus: 12,
    travelSpeedMultiplier: 1.0
  },
  {
    id: 'horse',
    name: 'Cestovní kůň',
    icon: '🐎',
    price: 140,
    description: 'Rychlý oř z chovů Valeria. Zkracuje dobu cestování mezi hexy na polovinu (1 hex za 0.5 dne).',
    inventoryBonus: 4,
    travelSpeedMultiplier: 0.5
  },
  {
    id: 'warhorse',
    name: 'Bojový hřebec',
    icon: '🎠',
    price: 280,
    description: 'Obrněný trénovaný oř. Zkracuje cestování na polovinu a na začátku venkovního boje uštědří zteč za 1d8 poškození.',
    inventoryBonus: 6,
    travelSpeedMultiplier: 0.5,
    combatPerk: 'Zteč při zahájení boje (+1d8 poškození)'
  }
];

/**
 * Calculates buy price with faction reputation modifier.
 * - Max discount at +20 rep: 25%
 * - Max penalty at -20 rep: +35%
 */
export function calculateBuyPrice(basePrice: number, reputation: number = 0): number {
  const clampedRep = Math.min(20, Math.max(-20, reputation));
  const discountFactor = clampedRep * 0.0125; // +20 rep = 0.25 (25% off), -20 rep = -0.25 (+25% markup)
  const finalMultiplier = Math.max(0.70, Math.min(1.40, 1.0 - discountFactor));
  return Math.max(1, Math.round(basePrice * finalMultiplier));
}

/**
 * Calculates sell price with faction reputation modifier.
 * Guaranteed anti-arbitrage invariant:
 * Under NO circumstances can sellPrice ever equal or exceed buyPrice.
 * Base sell is 40% of basePrice, scaling up to max 50% at +20 rep.
 */
export function calculateSellPrice(basePrice: number, reputation: number = 0): number {
  const buyPrice = calculateBuyPrice(basePrice, reputation);
  const clampedRep = Math.min(20, Math.max(-20, reputation));
  const repBonus = Math.max(0, clampedRep) * 0.004; // up to +0.08 bonus for friendly reputation
  const ratio = Math.min(0.48, 0.40 + repBonus);
  const rawSell = Math.floor(buyPrice * ratio);
  return Math.max(0, Math.min(buyPrice - 1, rawSell));
}

export interface TownServiceDef {
  id: string;
  name: string;
  category: 'blacksmith' | 'tavern' | 'temple' | 'stables';
  cost: number;
  icon: string;
  description: string;
  effectDescription: string;
}

export const BLACKSMITH_SERVICES: TownServiceDef[] = [
  {
    id: 'sharpen_weapon',
    name: 'Broušení čepele',
    category: 'blacksmith',
    cost: 15,
    icon: '⚔️',
    description: 'Mistr kovář naostří a vyváží tvou primární zbraň.',
    effectDescription: '+2 fyzické poškození na příští 3 souboje.'
  },
  {
    id: 'reinforce_armor',
    name: 'Výztuha zbroje',
    category: 'blacksmith',
    cost: 25,
    icon: '🛡️',
    description: 'Přidání nýtů a zpevnění kožených řemenů tvé zbroje.',
    effectDescription: '+1 AC (Obranné číslo) na příští 3 souboje.'
  },
  {
    id: 'silver_weapon',
    name: 'Svěcení a stříbření čepele',
    category: 'blacksmith',
    cost: 50,
    icon: '✨',
    description: 'Nanesení tenké vrstvy posvátného stříbra na ostří zbraně.',
    effectDescription: 'Stříbrná zbraň: +50% poškození nemrtvým a lykantropům na 5 bojů.'
  }
];

export const TAVERN_SERVICES: TownServiceDef[] = [
  {
    id: 'inn_lodging',
    name: 'Pokoj s měkkým lůžkem',
    category: 'tavern',
    cost: 10,
    icon: '🛏️',
    description: 'Klidný spánek v teple krčmy pod ochranou pevných zdí.',
    effectDescription: 'Plné vyléčení HP i kouzelných slotů + buff "Vyspalý do růžova" (+10 dočasných HP na 1 den).'
  },
  {
    id: 'inn_rations',
    name: 'Balíček cestovních zásob',
    category: 'tavern',
    cost: 3,
    icon: '🍖',
    description: 'Sušené hovězí maso, tvrdý chléb a sýr zabalené v plátně.',
    effectDescription: 'Doplní 1 dávku jídla (rations) do tvé zásoby pro táboření.'
  },
  {
    id: 'inn_rumors',
    name: 'Výkup místních pověstí a drbů',
    category: 'tavern',
    cost: 12,
    icon: '📜',
    description: 'Štamgasti u korbelu piva ti rádi poví, co se skrývá v okolních lesích a horách.',
    effectDescription: 'Odkryje mlhu neznáma a body zájmu na 1 až 2 okolních hexech.'
  }
];

export const TEMPLE_SERVICES: TownServiceDef[] = [
  {
    id: 'temple_tithe',
    name: 'Zlatá obětina bohům',
    category: 'temple',
    cost: 20,
    icon: '☀️',
    description: 'Polož zlaťáky na oltář Světlonoše a přijmi kněžské požehnání.',
    effectDescription: 'Požehnání inspirace: +1 k hodům na útok a obranu na 1 den.'
  },
  {
    id: 'temple_cure',
    name: 'Očista od kleteb a moru',
    category: 'temple',
    cost: 40,
    icon: '🕊️',
    description: 'Svatá voda a posvátné kadidlo očistí tvou krev od temných vlivů.',
    effectDescription: 'Odstraní stavy Otrava, Mor či Kletba a vyléčí vyčerpání z hladu.'
  }
];

export interface DiceGameResult {
  playerRolls: [number, number, number];
  playerTotal: number;
  npcRolls: [number, number, number];
  npcTotal: number;
  outcome: 'win' | 'lose' | 'tie' | 'jackpot';
  netGold: number;
  message: string;
}

/**
 * Deterministic client-side gambling: "Dračí oko" (Dragon's Eye).
 * 3d6 Player vs 3d6 NPC.
 * - Triples (e.g. [5,5,5]) = Jackpot (payout 3:1)
 * - Higher sum = Win (payout 1:1)
 * - Tie = Draw (bet returned)
 * - Lower sum = Lose (bet forfeited)
 */
export function playDragonEye(bet: number): DiceGameResult {
  const rollDie = () => Math.floor(Math.random() * 6) + 1;
  const pRolls: [number, number, number] = [rollDie(), rollDie(), rollDie()];
  const nRolls: [number, number, number] = [rollDie(), rollDie(), rollDie()];

  const pSum = pRolls[0] + pRolls[1] + pRolls[2];
  const nSum = nRolls[0] + nRolls[1] + nRolls[2];

  const pTriple = pRolls[0] === pRolls[1] && pRolls[1] === pRolls[2];
  const nTriple = nRolls[0] === nRolls[1] && nRolls[1] === nRolls[2];

  if (pTriple && !nTriple) {
    return {
      playerRolls: pRolls,
      playerTotal: pSum,
      npcRolls: nRolls,
      npcTotal: nSum,
      outcome: 'jackpot',
      netGold: bet * 2, // receives bet * 3 total (+2x net)
      message: `Dračí zrak! Hodil jsi trojici (${pRolls[0]}-${pRolls[1]}-${pRolls[2]})! Hostinský bledne a vyplácí trojnásobek!`
    };
  }

  if (nTriple && !pTriple) {
    return {
      playerRolls: pRolls,
      playerTotal: pSum,
      npcRolls: nRolls,
      npcTotal: nSum,
      outcome: 'lose',
      netGold: -bet,
      message: `Hostinský hodil trojici (${nRolls[0]}-${nRolls[1]}-${nRolls[2]})! Dračí oko padlo jemu. Ztrácíš sázku.`
    };
  }

  if (pSum > nSum) {
    return {
      playerRolls: pRolls,
      playerTotal: pSum,
      npcRolls: nRolls,
      npcTotal: nSum,
      outcome: 'win',
      netGold: bet,
      message: `Vítězství! Tvůj součet ${pSum} překonal hostinského ${nSum}. Vyhráváš ${bet} zlaťáků!`
    };
  } else if (pSum < nSum) {
    return {
      playerRolls: pRolls,
      playerTotal: pSum,
      npcRolls: nRolls,
      npcTotal: nSum,
      outcome: 'lose',
      netGold: -bet,
      message: `Prohra! Hostinský tě přehodil (${nSum} ku ${pSum}). Zlaťáky zůstávají na stole.`
    };
  } else {
    return {
      playerRolls: pRolls,
      playerTotal: pSum,
      npcRolls: nRolls,
      npcTotal: nSum,
      outcome: 'tie',
      netGold: 0,
      message: `Remíza! Oba jste hodili ${pSum}. Sázka se ti vrací.`
    };
  }
}

/**
 * List of standard merchant stock available in town shops.
 */
export const TOWN_MERCHANT_STOCK = [
  {
    id: 'potion_heal_small',
    name: 'Malý léčivý lektvar',
    type: 'lektvar',
    slot: 'žádný',
    rarity: 'common',
    icon: '🧪',
    basePrice: 15,
    desc: 'Červená bylinná tekutina. Okamžitě obnoví 25 HP.'
  },
  {
    id: 'potion_heal_medium',
    name: 'Větší léčivý lektvar',
    type: 'lektvar',
    slot: 'žádný',
    rarity: 'uncommon',
    icon: '⚗️',
    basePrice: 40,
    desc: 'Destilát ze slunečnice a lesních kořínků. Obnoví 60 HP.'
  },
  {
    id: 'potion_antidote',
    name: 'Protijed a hořký lektvar',
    type: 'lektvar',
    slot: 'žádný',
    rarity: 'common',
    icon: '🌿',
    basePrice: 20,
    desc: 'Odstraňuje účinky jedů a nákazy.'
  },
  {
    id: 'flask_alchemist_fire',
    name: 'Alchymistický oheň',
    type: 'cennost',
    slot: 'druhá ruka',
    rarity: 'uncommon',
    icon: '🔥',
    basePrice: 35,
    desc: 'Lepkavá tekutina, která se při kontaktu se vzduchem vznítí (plošné poškození).'
  },
  {
    id: 'item_rations_bundle',
    name: 'Balík sušeného proviantu (5x)',
    type: 'cennost',
    slot: 'žádný',
    rarity: 'common',
    icon: '🥖',
    basePrice: 12,
    desc: '5 porcí trvanlivého cestovního jídla.'
  },
  {
    id: 'weapon_iron_sword',
    name: 'Ocelový meč pěchoty',
    type: 'zbraň',
    slot: 'hlavní ruka',
    rarity: 'common',
    icon: '⚔️',
    basePrice: 45,
    attack_bonus: 2,
    damageDice: '1d8',
    desc: 'Kvalitně vykovaný meč se záštitou.'
  },
  {
    id: 'armor_studded_leather',
    name: 'Nýtovaná kožená zbroj',
    type: 'zbroj',
    slot: 'hruď',
    rarity: 'common',
    icon: '🥋',
    basePrice: 50,
    defense_bonus: 2,
    desc: 'Vyztužená tvrzená kůže s kovovými nýty.'
  },
  {
    id: 'shield_iron_kite',
    name: 'Kovaný pavézový štít',
    type: 'štít',
    slot: 'druhá ruka',
    rarity: 'common',
    icon: '🛡️',
    basePrice: 35,
    defense_bonus: 2,
    desc: 'Masivní dřevěný štít s kovaným lemem.'
  }
];
