/**
 * Canonical Items, Gear Sets & Exploration Loot Tables for Act 1 (Oakhaven Region)
 */

export interface SetBonus {
  count: number;
  description: string;
  attackBonus?: number;
  defenseBonus?: number;
  maxHpBonus?: number;
  spellSlotBonus?: number;
  critBonusPercent?: number;
  passivePerk?: string;
}

export interface SetDefinition {
  id: string;
  name: string;
  totalPieces: number;
  description: string;
  bonuses: SetBonus[];
}

export interface ItemDef {
  id: string;
  name: string;
  type: 'zbraň' | 'zbroj' | 'doplněk' | 'lektvar' | 'cennost';
  slot: 'hlavní ruka' | 'druhá ruka' | 'hruď' | 'hlava' | 'prsten' | 'krk' | 'žádný';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  sell_price: number;
  attack_bonus: number;
  defense_bonus: number;
  healing_amount: number;
  stats: string;
  description: string;
  setId?: string;
  setName?: string;
  locationFound?: string;
}

// -----------------------------------------------------------------------------
// 1. CANONICAL SET DEFINITIONS
// -----------------------------------------------------------------------------
export const CANONICAL_SETS: Record<string, SetDefinition> = {
  oakhaven_guard: {
    id: 'oakhaven_guard',
    name: 'Zbroj Stráže z Oakhavenu',
    totalPieces: 3,
    description: 'Těžká pohraniční zbroj kovaná z valerijské oceli se symbolem starého dubu.',
    bonuses: [
      {
        count: 2,
        description: '+1 k Obraně (AC)',
        defenseBonus: 1
      },
      {
        count: 3,
        description: 'Pevný postoj: +10 dočasných životů a odolnost vůči sražení',
        maxHpBonus: 10,
        passivePerk: 'Pevný postoj'
      }
    ]
  },
  kull_cult: {
    id: 'kull_cult',
    name: 'Roucho Stínového kultu Kulla',
    totalPieces: 3,
    description: 'Tajemná výstroj napuštěná prastarou esencí zapomenutého boha stínů.',
    bonuses: [
      {
        count: 2,
        description: '+1 Kapacita kouzelnických slotů',
        spellSlotBonus: 1
      },
      {
        count: 3,
        description: 'Dotek prázdnoty: +15% šance na kritický zásah ze stínů',
        critBonusPercent: 15,
        passivePerk: 'Dotek prázdnoty'
      }
    ]
  },
  forest_tracker: {
    id: 'forest_tracker',
    name: 'Stopař z Temného hvozdu',
    totalPieces: 3,
    description: 'Lehká a neslyšná výstroj ušitá z vyčiněné kůže lesních bestií.',
    bonuses: [
      {
        count: 2,
        description: '+1 k Útoku na dálku a v lesích nespotřebovává jídlo',
        attackBonus: 1,
        passivePerk: 'Lesní běžec'
      },
      {
        count: 3,
        description: 'První krev: První útok v každém boji udělí dvojnásobné poškození',
        passivePerk: 'První krev'
      }
    ]
  }
};

// -----------------------------------------------------------------------------
// 2. CANONICAL ITEMS CATALOG FOR ACT 1
// -----------------------------------------------------------------------------
export const CANONICAL_ITEMS: ItemDef[] = [
  // --- Set: Zbroj Stráže z Oakhavenu ---
  {
    id: 'oakhaven_guard_helm',
    name: 'Přilba pohraniční hlídky',
    type: 'zbroj',
    slot: 'hlava',
    rarity: 'uncommon',
    icon: 'Shield',
    sell_price: 35,
    attack_bonus: 0,
    defense_bonus: 1,
    healing_amount: 0,
    stats: 'Obrana +1',
    description: 'Kalená ocelová přilba s masivním nánosníkem a rytinou dubového listu.',
    setId: 'oakhaven_guard',
    setName: 'Zbroj Stráže z Oakhavenu',
    locationFound: 'Oakhaven – Strážnice'
  },
  {
    id: 'oakhaven_guard_chest',
    name: 'Plátový kyrys s erbem dubu',
    type: 'zbroj',
    slot: 'hruď',
    rarity: 'rare',
    icon: 'Shield',
    sell_price: 65,
    attack_bonus: 0,
    defense_bonus: 2,
    healing_amount: 0,
    stats: 'Obrana +2, Těžká zbroj',
    description: 'Kvalitní kyrys městské gardy. Pevné ocelové pláty nýtované na tvrzené kůži.',
    setId: 'oakhaven_guard',
    setName: 'Zbroj Stráže z Oakhavenu',
    locationFound: 'Ruiny kláštera – Kostnice'
  },
  {
    id: 'oakhaven_tower_shield',
    name: 'Oakhovenský věžový štít',
    type: 'zbroj',
    slot: 'druhá ruka',
    rarity: 'rare',
    icon: 'Shield',
    sell_price: 50,
    attack_bonus: 0,
    defense_bonus: 2,
    healing_amount: 0,
    stats: 'Obrana +2',
    description: 'Masivní dřevěný štít okovaný železem, který nosili obránci proti nájezdníkům.',
    setId: 'oakhaven_guard',
    setName: 'Zbroj Stráže z Oakhavenu',
    locationFound: 'Stará křižovatka – Vyhořelá mýtnice'
  },

  // --- Set: Roucho Stínového kultu Kulla ---
  {
    id: 'anna_rune_ring',
    name: 'Annin runový prsten',
    type: 'doplněk',
    slot: 'prsten',
    rarity: 'rare',
    icon: 'Ring',
    sell_price: 45,
    attack_bonus: 0,
    defense_bonus: 0,
    healing_amount: 0,
    stats: 'Aura stínu Kulla',
    description: 'Zlatý prsten se skrytou kacířskou rytinou boha Kulla. Vyzařuje mrazivý chlad.',
    setId: 'kull_cult',
    setName: 'Roucho Stínového kultu Kulla',
    locationFound: 'Starý mlýn – Borisova truhla'
  },
  {
    id: 'kull_whisper_hood',
    name: 'Kápě stínového šepotu',
    type: 'zbroj',
    slot: 'hlava',
    rarity: 'rare',
    icon: 'Shirt',
    sell_price: 55,
    attack_bonus: 1,
    defense_bonus: 1,
    healing_amount: 0,
    stats: 'Útok +1, Obrana +1',
    description: 'Sametová kápě barvy půlnočního popela, která pohlcuje světlo pochodní.',
    setId: 'kull_cult',
    setName: 'Roucho Stínového kultu Kulla',
    locationFound: 'Temný hvozd – Kamenný oltář stínů'
  },
  {
    id: 'kull_cultist_dagger',
    name: 'Kultistická dýka z krypt',
    type: 'zbraň',
    slot: 'hlavní ruka',
    rarity: 'epic',
    icon: 'Sword',
    sell_price: 80,
    attack_bonus: 2,
    defense_bonus: 0,
    healing_amount: 0,
    stats: 'Útok +2, +1k4 stínové zranění',
    description: 'Zubaté rituální ostří z obsidiánu zčernalého obětní krví.',
    setId: 'kull_cult',
    setName: 'Roucho Stínového kultu Kulla',
    locationFound: 'Ruiny kláštera – Oltář v kryptě'
  },

  // --- Set: Stopař z Temného hvozdu ---
  {
    id: 'tracker_leather_vest',
    name: 'Vesta z medvědí kůže',
    type: 'zbroj',
    slot: 'hruď',
    rarity: 'uncommon',
    icon: 'Shirt',
    sell_price: 40,
    attack_bonus: 0,
    defense_bonus: 1,
    healing_amount: 0,
    stats: 'Obrana +1, Odolnost proti chladu',
    description: 'Tuhá huňatá kůže z lesního medvěda, prošívaná šlachami.',
    setId: 'forest_tracker',
    setName: 'Stopař z Temného hvozdu',
    locationFound: 'Stará křižovatka – Přepadený vůz lovců'
  },
  {
    id: 'tracker_fang_amulet',
    name: 'Amulet z krystalického tesáku',
    type: 'doplněk',
    slot: 'krk',
    rarity: 'rare',
    icon: 'Ring',
    sell_price: 60,
    attack_bonus: 1,
    defense_bonus: 0,
    healing_amount: 0,
    stats: 'Útok +1, Zrak šelmy',
    description: 'Vyleštěný tesák z krystalického vlka zavěšený na koženém řemínku.',
    setId: 'forest_tracker',
    setName: 'Stopař z Temného hvozdu',
    locationFound: 'Temný hvozd – Doupě alfa vlka'
  },
  {
    id: 'tracker_composite_bow',
    name: 'Lovecký kompozitní luk',
    type: 'zbraň',
    slot: 'hlavní ruka',
    rarity: 'rare',
    icon: 'Wand',
    sell_price: 75,
    attack_bonus: 2,
    defense_bonus: 0,
    healing_amount: 0,
    stats: 'Útok +2, Průrazná zbraň',
    description: 'Mistrovsky lepený luk z tisového dřeva a rohů divokého tura.',
    setId: 'forest_tracker',
    setName: 'Stopař z Temného hvozdu',
    locationFound: 'Skrytý tábor elfů – Lovci Vyldie'
  },

  // --- Ostatní Unikátní Relikvie 1. Aktu ---
  {
    id: 'solarian_holy_flail',
    name: 'Posvěcený řemdih sv. Judity',
    type: 'zbraň',
    slot: 'hlavní ruka',
    rarity: 'rare',
    icon: 'Sword',
    sell_price: 70,
    attack_bonus: 2,
    defense_bonus: 0,
    healing_amount: 0,
    stats: 'Útok +2, +1k6 zářivé proti nemrtvým',
    description: 'Těžká okovaná koule z posvěceného stříbra zavěšená na řetězu.',
    locationFound: 'Ruiny kláštera – Svatyně'
  },
  {
    id: 'torben_masterwork_hammer',
    name: 'Torbenovo mistrovské kované kladivo',
    type: 'zbraň',
    slot: 'hlavní ruka',
    rarity: 'rare',
    icon: 'Sword',
    sell_price: 65,
    attack_bonus: 2,
    defense_bonus: 0,
    healing_amount: 0,
    stats: 'Útok +2, Drtivé poškození',
    description: 'Těžké kovářské kladivo z trpasličí oceli, ztracené při závalu dolu.',
    locationFound: 'Opuštěný důl – Kovářská štola'
  },
  {
    id: 'dwarven_tinderbox',
    name: 'Prastaré trpasličí křesadlo',
    type: 'cennost',
    slot: 'žádný',
    rarity: 'uncommon',
    icon: 'Package',
    sell_price: 30,
    attack_bonus: 0,
    defense_bonus: 0,
    healing_amount: 0,
    stats: 'Nevyčerpatelný oheň v táboře',
    description: 'Masivní mosazná krabička s runami ohně. Umožňuje bezpečné rozdělání ohně i v dešti.',
    locationFound: 'Opuštěný důl – Skladiště'
  },
  {
    id: 'kull_heart_shard',
    name: 'Střípek Srdce Kulla',
    type: 'cennost',
    slot: 'žádný',
    rarity: 'epic',
    icon: 'Package',
    sell_price: 150,
    attack_bonus: 0,
    defense_bonus: 0,
    healing_amount: 0,
    stats: 'Klíčová relikvie 1. Aktu',
    description: 'Mrazivý černý krystal pulzující temným tepem Probuzených. Klíč k moci i zkáze.',
    locationFound: 'Krypta sv. Judity – Hlubinný oltář'
  }
];

// -----------------------------------------------------------------------------
// 3. EXPLORATION LOOT TABLE BY NODE ID
// -----------------------------------------------------------------------------
export interface NodeExplorationData {
  nodeId: string;
  nodeName: string;
  dangerLevel: number; // 1 to 5
  encounterDc: number; // d20 DC to avoid ambush
  guaranteedItem: ItemDef;
  discoveryDescription: string;
  clearedDescription: string;
  bonusGold: number;
  bonusXp: number;
}

export const NODE_EXPLORATION_MAP: Record<string, NodeExplorationData> = {
  crossroads: {
    nodeId: 'crossroads',
    nodeName: 'Stará křižovatka',
    dangerLevel: 1,
    encounterDc: 10,
    guaranteedItem: CANONICAL_ITEMS.find(i => i.id === 'oakhaven_tower_shield')!,
    discoveryDescription: 'V troskách vyhořelé mýtnice jsi pod vrstvou ohořelých trámů vypáčil zamčenou zbrojní truhlu! Uvnitř se leskne mohutný Oakhovenský věžový štít.',
    clearedDescription: 'Stará křižovatka je tichá. Ohořelé trámy mýtnice jsi už prohledal a zůstal zde jen popel a staré stopy kol.',
    bonusGold: 20,
    bonusXp: 35
  },
  monastery_ruins: {
    nodeId: 'monastery_ruins',
    nodeName: 'Ruiny kláštera',
    dangerLevel: 2,
    encounterDc: 13,
    guaranteedItem: CANONICAL_ITEMS.find(i => i.id === 'oakhaven_guard_chest')!,
    discoveryDescription: 'Mezi zborcenými sloupy staré kostnice jsi odkryl kamennou desku se znakem dubu. Pod ní ležel nedotčený Plátový kyrys s erbem dubu!',
    clearedDescription: 'Rozvaliny kláštera sv. Judity zejí prázdnotou. Sutiny a staré hrobky jsi už důkladně prozkoumal.',
    bonusGold: 35,
    bonusXp: 60
  },
  old_mine: {
    nodeId: 'old_mine',
    nodeName: 'Opuštěný důl',
    dangerLevel: 2,
    encounterDc: 12,
    guaranteedItem: CANONICAL_ITEMS.find(i => i.id === 'torben_masterwork_hammer')!,
    discoveryDescription: 'V polorozpadlé kovárenské štole za hnízdem troglů jsi našel starou kovadlinu a v ní vražené Torbenovo mistrovské kované kladivo!',
    clearedDescription: 'Důlní štoly tiše kapou. Žíly i opuštěná pracoviště jsou již prozkoumána a troglové se stáhli hlouběji do útrob hory.',
    bonusGold: 40,
    bonusXp: 50
  },
  dark_forest: {
    nodeId: 'dark_forest',
    nodeName: 'Temný hvozd',
    dangerLevel: 3,
    encounterDc: 14,
    guaranteedItem: CANONICAL_ITEMS.find(i => i.id === 'tracker_fang_amulet')!,
    discoveryDescription: 'Hluboko mezi prastarými stromy jsi nalezl doupě krystalické šelmy. Mezi rozervanou zbrojí dobrodruhů se třpytí Amulet z krystalického tesáku!',
    clearedDescription: 'Temný hvozd tiše šumí. Šelmy vědí o tvé přítomnosti a doupata v tomto revíru jsou vyprázdněna.',
    bonusGold: 25,
    bonusXp: 55
  },
  elf_camp: {
    nodeId: 'elf_camp',
    nodeName: 'Skrytý tábor elfů',
    dangerLevel: 1,
    encounterDc: 8,
    guaranteedItem: CANONICAL_ITEMS.find(i => i.id === 'tracker_composite_bow')!,
    discoveryDescription: 'Elfští stopaři ocenili tvé odhodlání a ochranu hranic. Šamanka Sylwen ti svěřila posvátný Lovecký kompozitní luk!',
    clearedDescription: 'Elfí hlídky tě zdraví s tichou úctou. Tábor ti poskytuje bezpečný azyl pod korunami stromů.',
    bonusGold: 15,
    bonusXp: 40
  },
  oakhaven: {
    nodeId: 'oakhaven',
    nodeName: 'Oakhaven (Město)',
    dangerLevel: 1,
    encounterDc: 5,
    guaranteedItem: CANONICAL_ITEMS.find(i => i.id === 'oakhaven_guard_helm')!,
    discoveryDescription: 'V městské zbrojnici jsi pomohl strážmistru Aldricovi uspořádat zásoby. Za tvé služby ti věnoval Přilbu pohraniční hlídky!',
    clearedDescription: 'Ulice Oakhaven jsou pod kontrolou městské gardy. Prozkoumal jsi všechna skrytá zákoutí.',
    bonusGold: 10,
    bonusXp: 20
  }
};
