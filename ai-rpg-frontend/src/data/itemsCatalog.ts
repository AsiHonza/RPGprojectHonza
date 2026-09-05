// D&D Taxonomie, Šablony vybavení a 48 unikátních třídních artefaktů
import { StatusEffectType } from './classSkillTrees';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemType = 'zbraň' | 'zbroj' | 'štít' | 'doplněk' | 'lektvar' | 'cennost';
export type EquipSlot = 'hlavní ruka' | 'druhá ruka' | 'obouruční' | 'hruď' | 'hlava' | 'prsten' | 'krk' | 'žádný';

export interface ItemDef {
  id: string;
  name: string;
  desc?: string;
  type: ItemType;
  slot: EquipSlot;
  rarity: ItemRarity;
  icon: string;
  weaponType?: string; // 'dýka', 'meč', 'obouruční', 'luk', 'kuše', 'hůl', 'kladivo'
  armorType?: string;  // 'róba', 'lehká', 'střední', 'těžká', 'štít'
  allowedClasses?: string[]; // pokud prázdné, všichni
  attack_bonus?: number;
  damageDice?: string; // např. "1d8", "2d6"
  defense_bonus?: number; // AC bonus
  flatDamageReduction?: number; // snížení fyzického zranění
  resistances?: {
    fire?: number;   // 0.5 = 50%
    cold?: number;
    poison?: number;
    bleed?: number;
  };
  statusImmunities?: StatusEffectType[];
  statusAffliction?: {
    type: StatusEffectType;
    chance: number; // 0.1 až 1.0
    duration: number;
    damagePerRound?: number;
  };
  specialEffect?: string;
  synergyClass?: string;
  synergySkillId?: string;
  sell_price: number;
  stats?: string;
}

// Pravidla způsobilosti (Class Proficiencies)
export const CLASS_PROFICIENCIES: Record<string, { weapons: string[]; armors: string[] }> = {
  "Barbar": {
    weapons: ["jednoruční", "obouruční", "sekera", "kladivo", "dýka"],
    armors: ["lehká", "střední", "štít"]
  },
  "Kouzelník": {
    weapons: ["hůl", "hůlka", "dýka"],
    armors: ["róba"]
  },
  "Tulák": {
    weapons: ["dýka", "krátký meč", "luk", "kuše"],
    armors: ["lehká"]
  },
  "Klerik": {
    weapons: ["kladivo", "palcát", "jednoruční", "hůl"],
    armors: ["lehká", "střední", "těžká", "štít"]
  },
  "Bojovník": {
    weapons: ["jednoruční", "obouruční", "sekera", "kladivo", "luk", "kuše", "dýka"],
    armors: ["lehká", "střední", "těžká", "štít"]
  },
  "Černokněžník": {
    weapons: ["hůl", "dýka", "hůlka", "jednoruční"],
    armors: ["róba", "lehká"]
  },
  "Bard": {
    weapons: ["loutna", "dýka", "krátký meč", "luk"],
    armors: ["lehká", "střední"]
  },
  "Paladin": {
    weapons: ["jednoruční", "obouruční", "sekera", "kladivo", "palcát"],
    armors: ["lehká", "střední", "těžká", "štít"]
  },
  "Mnich": {
    weapons: ["pěsti", "hůl", "dýka"],
    armors: ["róba"]
  },
  "Druid": {
    weapons: ["hůl", "srp", "dýka"],
    armors: ["róba", "lehká"] // Přísný zákaz kovových zbrojí!
  },
  "Hraničář": {
    weapons: ["luk", "kuše", "dýka", "krátký meč", "jednoruční"],
    armors: ["lehká", "střední", "štít"]
  },
  "Čaroděj": {
    weapons: ["hůl", "hůlka", "dýka"],
    armors: ["róba"]
  }
};

// 48 Unikátních Epických a Legendárních Třídních Artefaktů
export const CLASS_ARTIFACTS: Record<string, ItemDef[]> = {
  "Barbar": [
    {
      id: "art_barbar_axe",
      name: "Krvavá sekera krále obrů",
      desc: "Kolosální obouruční sekera potřísněná rituální krví. Čepel rezonuje s nekontrolovatelným hněvem svého nositele.",
      type: "zbraň",
      slot: "obouruční",
      rarity: "legendary",
      icon: "Axe",
      weaponType: "obouruční",
      allowedClasses: ["Barbar"],
      attack_bonus: 3,
      damageDice: "1d12",
      statusAffliction: { type: "bleeding", chance: 0.6, duration: 3, damagePerRound: 6 },
      synergyClass: "Barbar",
      synergySkillId: "barbar_rage",
      specialEffect: "Prodlužuje Zuřivost o 2 kola. Během zuřivosti léčí barbara za 15 % způsobeného zranění.",
      sell_price: 180,
      stats: "Útok +3, 1d12 Fyz., Krvácení (60%), Posiluje Zuřivost"
    },
    {
      id: "art_barbar_armor",
      name: "Hrudní plát z kůže behemota",
      desc: "Vrstvy neprostupných šlach a plátů z pradávné ještěří stvůry. Tlumí drtivé rány a zastavuje krvácení.",
      type: "zbroj",
      slot: "hruď",
      rarity: "legendary",
      icon: "Shield",
      armorType: "střední",
      allowedClasses: ["Barbar"],
      defense_bonus: 4,
      flatDamageReduction: 3,
      resistances: { bleed: 0.7, fire: 0.3 },
      statusImmunities: ["bleeding"],
      specialEffect: "+25 k maximálnímu zdraví a ploché snížení každého utrženého zranění o 3.",
      sell_price: 160,
      stats: "Obrana +4, +25 HP, Redukce -3 dmg, Imunita: Krvácení"
    },
    {
      id: "art_barbar_amulet",
      name: "Talisman nespoutaného běsnění",
      desc: "Prastarý zub jeskynního medvěda vyrytý runami zuřivosti.",
      type: "doplněk",
      slot: "krk",
      rarity: "epic",
      icon: "ShieldAlert",
      allowedClasses: ["Barbar"],
      specialEffect: "Při poklesu HP pod 30 % okamžitě aktivuje Zuřivost zdarma bez spotřeby AP (1x za boj).",
      sell_price: 120,
      stats: "Při HP < 30% aktivuje Zuřivost zdarma"
    },
    {
      id: "art_barbar_belt",
      name: "Pás drtivé síly",
      desc: "Kovaný pás s těžkou bronzovou sponou, která dodává úderům ničivou kinetickou razanci.",
      type: "doplněk",
      slot: "prsten",
      rarity: "epic",
      icon: "Activity",
      allowedClasses: ["Barbar"],
      attack_bonus: 2,
      specialEffect: "Zemětřesný dup má o 1 kolo nižší cooldown a trvale snižuje AC nepřátel o 2.",
      sell_price: 110,
      stats: "Útok +2, Cooldown Zemětřesného dupu -1"
    }
  ],

  "Kouzelník": [
    {
      id: "art_wiz_staff",
      name: "Hůl věčného plamene",
      desc: "Vyřezaná z větve spáleného Světostromu, uvnitř které pulzuje živé plamenné jádro.",
      type: "zbraň",
      slot: "obouruční",
      rarity: "legendary",
      icon: "Flame",
      weaponType: "hůl",
      allowedClasses: ["Kouzelník"],
      attack_bonus: 3,
      damageDice: "1d8",
      statusAffliction: { type: "burning", chance: 0.7, duration: 3, damagePerRound: 6 },
      synergyClass: "Kouzelník",
      synergySkillId: "wiz_fireball",
      specialEffect: "Snižuje AP cenu Ohnivé koule o 1 AP a DoT poškození Hořením působí dvojnásobné zranění.",
      sell_price: 180,
      stats: "Kouzlení +3, Ohnivá koule stojí -1 AP, DoT Oheň x2"
    },
    {
      id: "art_wiz_robe",
      name: "Róba arcimága Aethelgardu",
      desc: "Tkaná z hvězdného hedvábí, protkaná ochrannými glyfy, které pohlcují magické útoky.",
      type: "zbroj",
      slot: "hruď",
      rarity: "legendary",
      icon: "Shirt",
      armorType: "róba",
      allowedClasses: ["Kouzelník"],
      defense_bonus: 4,
      resistances: { fire: 0.5, cold: 0.5 },
      specialEffect: "+4 AC a 50% odolnost proti ohni i mrazu. Magická kouzla mají o 15 % vyšší poškození.",
      sell_price: 160,
      stats: "Obrana +4, Odolnost: Oheň/Led 50%, Kouzla +15%"
    },
    {
      id: "art_wiz_diadem",
      name: "Diadém nekonečného vhledu",
      desc: "Zlatá čelenka se safírem, která zostřuje mysl a odhaluje slabiny v magické tkáni.",
      type: "zbroj",
      slot: "hlava",
      rarity: "epic",
      icon: "Sparkles",
      armorType: "róba",
      allowedClasses: ["Kouzelník"],
      defense_bonus: 2,
      specialEffect: "Magická střela vystřelí o 2 naváděné střely více a má 25% šanci zmrazit cíl.",
      sell_price: 130,
      stats: "Obrana +2, Magická střela +2 střely navíc"
    },
    {
      id: "art_wiz_ring",
      name: "Prsten arkánového zrcadla",
      desc: "Prsten s leštěným obsidiánem, který odráží nepřátelskou agresi.",
      type: "doplněk",
      slot: "prsten",
      rarity: "epic",
      icon: "Shield",
      allowedClasses: ["Kouzelník"],
      specialEffect: "Kouzlo Magický štít odrazí 100 % zablokovaného poškození zpět na útočníka.",
      sell_price: 115,
      stats: "Magický štít odráží 100% poškození zpět"
    }
  ],

  "Tulák": [
    {
      id: "art_rogue_dagger",
      name: "Čepel tichého stínu",
      desc: "Kalená v noční rose a stínové esenci. Neprobouzí ani nejlehčí závan větru.",
      type: "zbraň",
      slot: "hlavní ruka",
      rarity: "legendary",
      icon: "Swords",
      weaponType: "dýka",
      allowedClasses: ["Tulák"],
      attack_bonus: 3,
      damageDice: "1d6",
      statusAffliction: { type: "bleeding", chance: 0.8, duration: 3, damagePerRound: 5 },
      synergyClass: "Tulák",
      synergySkillId: "rogue_sneak_attack",
      specialEffect: "Zákeřný útok má 100% šanci na kritický zásah na cíle trpící Krvácením nebo Otravou.",
      sell_price: 175,
      stats: "Útok +3, 1d6 Fyz., Krvácení (80%), Garantovaný sneak crit"
    },
    {
      id: "art_rogue_cowl",
      name: "Kápě šerého fantoma",
      desc: "Kápě z tkaniny protkané stíny zlodějského cechu. Při zabití zahalí nositele neviditelností.",
      type: "zbroj",
      slot: "hruď",
      rarity: "legendary",
      icon: "Eye",
      armorType: "lehká",
      allowedClasses: ["Tulák"],
      defense_bonus: 3,
      resistances: { poison: 0.5, bleed: 0.5 },
      specialEffect: "Po zabití nepřítele se tulák na 1 kolo zneviditelní (+5 AC a nepřátelé na něj nemohou cílit).",
      sell_price: 165,
      stats: "Obrana +3, Po zabití neviditelnost na 1 kolo"
    },
    {
      id: "art_rogue_ring",
      name: "Prsten mistra vrahů",
      desc: "Hladký platinový kroužek s rytinou lebky s dýkou v oku.",
      type: "doplněk",
      slot: "prsten",
      rarity: "epic",
      icon: "Target",
      allowedClasses: ["Tulák"],
      attack_bonus: 2,
      statusImmunities: ["stunned"],
      specialEffect: "Kritické zásahy udělují 250 % poškození. Plná imunita vůči Omráčení.",
      sell_price: 130,
      stats: "Kritický zásah 250% dmg, Imunita: Omráčení"
    },
    {
      id: "art_rogue_belt",
      name: "Toulcový pás stínových čepelí",
      desc: "Pás s bleskovými pouzdry na vrhací dýky z černěné oceli.",
      type: "doplněk",
      slot: "prsten",
      rarity: "epic",
      icon: "Crosshair",
      allowedClasses: ["Tulák"],
      specialEffect: "Vrh dýkami stojí o 1 AP méně (stojí jen 1 AP) a garantuje Krvácení všem zasaženým.",
      sell_price: 120,
      stats: "Vrh dýkami stojí pouze 1 AP, 100% Krvácení"
    }
  ],

  "Klerik": [
    {
      id: "art_cleric_hammer",
      name: "Kladivo úsvitu",
      desc: "Těžké kladivo požehnané v pramenitém světle Prvního chrámu. Sálá slunečním žárem.",
      type: "zbraň",
      slot: "hlavní ruka",
      rarity: "legendary",
      icon: "Sun",
      weaponType: "kladivo",
      allowedClasses: ["Klerik"],
      attack_bonus: 3,
      damageDice: "1d8",
      damageBonus: 4,
      synergyClass: "Klerik",
      synergySkillId: "cleric_healing_word",
      specialEffect: "Léčivé slovo zároveň udělí radiant poškození nejbližšímu nepříteli v hodnotě vyléčených HP.",
      sell_price: 180,
      stats: "Útok +3, 1d8+4 Radiant, Léčení zraňuje nejbližšího nepřítele"
    },
    {
      id: "art_cleric_armor",
      name: "Plátová zbroj slunečního rytíře",
      desc: "Kovaná z pozlacené oceli s reliéfem vycházejícího slunce. Chrání duši i tělo před temnotou.",
      type: "zbroj",
      slot: "hruď",
      rarity: "legendary",
      icon: "Shield",
      armorType: "těžká",
      allowedClasses: ["Klerik"],
      defense_bonus: 5,
      flatDamageReduction: 2,
      resistances: { fire: 0.5, poison: 0.5 },
      specialEffect: "50% odolnost proti ohni i nekrotickému poškození. Útočníci na blízko utrží 5 radiant zranění.",
      sell_price: 170,
      stats: "Obrana +5, Redukce -2 dmg, Útočníci utrží 5 dmg"
    },
    {
      id: "art_cleric_amulet",
      name: "Pečeť věčného světla",
      desc: "Relikviář s jiskrou posvátného plamene, která nedovolí nositeli vyhasnout.",
      type: "doplněk",
      slot: "krk",
      rarity: "epic",
      icon: "Sparkles",
      allowedClasses: ["Klerik"],
      specialEffect: "Při poklesu na 0 HP se klerik okamžitě probudí s 50 % HP a oslepí bojiště (1x za boj).",
      sell_price: 135,
      stats: "Při 0 HP návrat s 50% HP a oslepení nepřátel"
    },
    {
      id: "art_cleric_shield",
      name: "Štít ranní hvězdy",
      desc: "Masivní kruhový štít zdobený zářícím krystalem, který usnadňuje sesílání svatých vln.",
      type: "štít",
      slot: "druhá ruka",
      rarity: "epic",
      icon: "Shield",
      armorType: "štít",
      allowedClasses: ["Klerik"],
      defense_bonus: 3,
      specialEffect: "Svatá záře (Holy Nova) má o 1 kolo nižší cooldown a léčí klerika o 30 % více.",
      sell_price: 125,
      stats: "Obrana +3, Svatá záře CD -1, Léčení +30%"
    }
  ],

  "Bojovník": [
    {
      id: "art_fighter_sword",
      name: "Ostří neporaženého šampiona",
      desc: "Čepel ukovaná z meteorického železa, která prořízla brnění králů i dračí kůže.",
      type: "zbraň",
      slot: "obouruční",
      rarity: "legendary",
      icon: "Swords",
      weaponType: "obouruční",
      allowedClasses: ["Bojovník"],
      attack_bonus: 3,
      damageDice: "2d6",
      statusAffliction: { type: "bleeding", chance: 0.5, duration: 3, damagePerRound: 5 },
      synergyClass: "Bojovník",
      synergySkillId: "fighter_action_surge",
      specialEffect: "Použití Akční vlny okamžitě resetuje cooldown schopnosti Popravčí úder.",
      sell_price: 180,
      stats: "Útok +3, 2d6 Fyz., Krvácení (50%), Akční vlna resetuje Popravčí úder"
    },
    {
      id: "art_fighter_armor",
      name: "Brnění dračího strážce",
      desc: "Těžká plátovka vyztužená šupinami prastarého červeného draka.",
      type: "zbroj",
      slot: "hruď",
      rarity: "legendary",
      icon: "Shield",
      armorType: "těžká",
      allowedClasses: ["Bojovník"],
      defense_bonus: 5,
      flatDamageReduction: 4,
      resistances: { fire: 0.6 },
      statusImmunities: ["burning"],
      specialEffect: "Plochá redukce veškerého zranění o 4. Plná imunita vůči Hoření.",
      sell_price: 175,
      stats: "Obrana +5, Redukce -4 dmg, Imunita: Hoření"
    },
    {
      id: "art_fighter_ring",
      name: "Válečnický prsten cti",
      desc: "Železný pečetní prsten vojevůdců arény.",
      type: "doplněk",
      slot: "prsten",
      rarity: "epic",
      icon: "Target",
      allowedClasses: ["Bojovník"],
      attack_bonus: 2,
      specialEffect: "Kritické zásahy mají rozsah 18-20 na d20 a okamžitě způsobí Krvácení.",
      sell_price: 130,
      stats: "Kritický rozsah 18-20 na d20, Krvácení"
    },
    {
      id: "art_fighter_shield",
      name: "Pavéza neoblomné pevnosti",
      desc: "Masivní věžový štít z tvrzené oceli, za kterým se bojovník stává nehybnou hradbou.",
      type: "štít",
      slot: "druhá ruka",
      rarity: "epic",
      icon: "Shield",
      armorType: "štít",
      allowedClasses: ["Bojovník"],
      defense_bonus: 4,
      specialEffect: "Obranný postoj (Parry) dává +6 AC namísto +4 a vrátí protiútok se 100% poškozením.",
      sell_price: 125,
      stats: "Obrana +4, Parry dává +6 AC a silnější protiútok"
    }
  ],

  "Černokněžník": [
    {
      id: "art_warlock_robe",
      name: "Roucha zapomenutého paktu",
      desc: "Róba ušitá z mlhy prázdnoty. Z jejích lemů prosakují temné stíny, které pohlcují životní sílu.",
      type: "zbroj",
      slot: "hruď",
      rarity: "legendary",
      icon: "Shirt",
      armorType: "róba",
      allowedClasses: ["Černokněžník"],
      defense_bonus: 3,
      resistances: { cold: 0.5, poison: 0.5 },
      synergyClass: "Černokněžník",
      synergySkillId: "warlock_hex",
      specialEffect: "Kletba Hex se automaticky aplikuje na všechny cíle zasažené plošným kouzlem Hladová temnota.",
      sell_price: 175,
      stats: "Obrana +3, Hex se aplikuje na všechny v Hladové temnotě"
    },
    {
      id: "art_warlock_staff",
      name: "Hůl temného patrona",
      desc: "Hůl zakončená černým okem z jiných dimenzí, které pozoruje duše nepřátel.",
      type: "zbraň",
      slot: "obouruční",
      rarity: "legendary",
      icon: "Skull",
      weaponType: "hůl",
      allowedClasses: ["Černokněžník"],
      attack_bonus: 3,
      damageDice: "1d8",
      specialEffect: "Tříštivý výboj (Eldritch Blast) zraní i všechny nepřátele stojící blízko hlavního terče (odraz za 50% dmg).",
      sell_price: 180,
      stats: "Kouzlení +3, Tříštivý výboj přeskočí na okolní cíle"
    },
    {
      id: "art_warlock_amulet",
      name: "Amulet oka prázdnoty",
      desc: "Černý kámen vsazený do zkroucených stříbrných chapadel.",
      type: "doplněk",
      slot: "krk",
      rarity: "epic",
      icon: "Eye",
      allowedClasses: ["Černokněžník"],
      specialEffect: "50 % veškerého DoT poškození (Oheň, Kletba), které nepřátelé utrží, vyléčí černokněžníka.",
      sell_price: 135,
      stats: "50% nepřátelského DoT tě léčí"
    },
    {
      id: "art_warlock_ring",
      name: "Prsten pekelného plamene",
      desc: "Vroucí prsten ukovaný v hlubinách devíti pekel.",
      type: "doplněk",
      slot: "prsten",
      rarity: "epic",
      icon: "Flame",
      allowedClasses: ["Černokněžník"],
      resistances: { fire: 0.5 },
      specialEffect: "Pekelná odveta (Hellish Rebuke) nestojí žádné AP a zapálí útočníka na 3 kola.",
      sell_price: 120,
      stats: "Hellish Rebuke stojí 0 AP, Odolnost: Oheň 50%"
    }
  ],

  "Bard": [
    {
      id: "art_bard_lute",
      name: "Loutna šíleného barda",
      desc: "Struny z dračích šlach a rezonanční tělo z perleťového javoru. Její tóny pronikají až do morku kostí.",
      type: "zbraň",
      slot: "obouruční",
      rarity: "legendary",
      icon: "Sparkles",
      weaponType: "loutna",
      allowedClasses: ["Bard"],
      attack_bonus: 3,
      damageDice: "1d8",
      synergyClass: "Bard",
      synergySkillId: "bard_vicious_mockery",
      specialEffect: "Jízlivý posměch (Vicious Mockery) zasáhne VŠECHNY nepřátele naráz (AoE posměch).",
      sell_price: 180,
      stats: "Útok +3, Jízlivý posměch zasáhne všechny nepřátele naráz"
    },
    {
      id: "art_bard_jacket",
      name: "Kabátec slavíka",
      desc: "Hedvábný kabátec v zářivých barvách, který chrání nositele před psychickými i magickými šoky.",
      type: "zbroj",
      slot: "hruď",
      rarity: "legendary",
      icon: "Shirt",
      armorType: "lehká",
      allowedClasses: ["Bard"],
      defense_bonus: 4,
      statusImmunities: ["stunned"],
      specialEffect: "Nositel je zcela imunní vůči Omráčení (💫) a Zmatení. +15 % šance na vyhnutí se útokům.",
      sell_price: 165,
      stats: "Obrana +4, Imunita: Omráčení, Úhyb +15%"
    },
    {
      id: "art_bard_ring",
      name: "Prsten harmonické ozvěny",
      desc: "Dva spletené kroužky ze stříbra a jantaru, které prodlužují trvání písní.",
      type: "doplněk",
      slot: "prsten",
      rarity: "epic",
      icon: "HeartHandshake",
      allowedClasses: ["Bard"],
      specialEffect: "Každé úspěšné seslání Písně léčení obnoví +1 AP bardovi.",
      sell_price: 125,
      stats: "Píseň léčení vrátí +1 AP"
    },
    {
      id: "art_bard_amulet",
      name: "Amulet inspirující přítomnosti",
      desc: "Zlatý medailon s motivem slavíka, který vyzařuje uklidňující auru.",
      type: "doplněk",
      slot: "krk",
      rarity: "epic",
      icon: "Sparkles",
      allowedClasses: ["Bard"],
      specialEffect: "Labutí píseň (Crescendo) má o 1 kolo nižší cooldown a zničí všechny nepřátelské štíty.",
      sell_price: 120,
      stats: "Labutí píseň CD -1, Ničí nepřátelské štíty"
    }
  ],

  "Paladin": [
    {
      id: "art_paladin_shield",
      name: "Zářící štít svatého slunce",
      desc: "Masivní štít zdobený leštěným zlatem. Kdykoliv dopadne rána na nepřítele, štít absorbuje svatou energii.",
      type: "štít",
      slot: "druhá ruka",
      rarity: "legendary",
      icon: "Shield",
      armorType: "štít",
      allowedClasses: ["Paladin"],
      defense_bonus: 4,
      synergyClass: "Paladin",
      synergySkillId: "paladin_smite",
      specialEffect: "Při každém použití Božského úderu získá paladin ochranný štít 🛡️ na 20 HP.",
      sell_price: 180,
      stats: "Obrana +4, Božský úder přidá štít na 20 HP"
    },
    {
      id: "art_paladin_hammer",
      name: "Kladivo spravedlivého soudu",
      desc: "Válečné kladivo s runami spravedlnosti. Drtí nepřátelské štíty a proráží i nejtlustší zbroj.",
      type: "zbraň",
      slot: "hlavní ruka",
      rarity: "legendary",
      icon: "Sun",
      weaponType: "kladivo",
      allowedClasses: ["Paladin"],
      attack_bonus: 3,
      damageDice: "1d8",
      damageBonus: 4,
      specialEffect: "Útoky tímto kladivem ignorují nepřátelské štíty a trvale snižují AC cíle o 2.",
      sell_price: 175,
      stats: "Útok +3, 1d8+4 Radiant, Ignoruje štíty, Snižuje AC o -2"
    },
    {
      id: "art_paladin_cloak",
      name: "Plášť andělské přísahy",
      desc: "Bílý plášť lemovaný zlatou výšivkou řádu paladinů.",
      type: "zbroj",
      slot: "hruď",
      rarity: "epic",
      icon: "ShieldAlert",
      armorType: "těžká",
      allowedClasses: ["Paladin"],
      defense_bonus: 4,
      resistances: { fire: 0.3, poison: 0.5, bleed: 0.5 },
      specialEffect: "Veškeré DoT efekty na paladinovi způsobují o 50 % nižší poškození a léčí ho.",
      sell_price: 140,
      stats: "Obrana +4, DoT efekty tě poškozují o 50% méně"
    },
    {
      id: "art_paladin_ring",
      name: "Prsten božské odplaty",
      desc: "Těžký pečetní prsten vykovaný z posvěceného stříbra.",
      type: "doplněk",
      slot: "prsten",
      rarity: "epic",
      icon: "Sun",
      allowedClasses: ["Paladin"],
      specialEffect: "Kdykoliv nepřítel mine paladina v boji, utrží 8 bodů radiant poškození.",
      sell_price: 125,
      stats: "Minutí nepřítele vrátí 8 radiant zranění"
    }
  ],

  "Mnich": [
    {
      id: "art_monk_wraps",
      name: "Rukavice bouřného větru",
      desc: "Hedvábné bandáže na ruce protkané bleskovou nití kláštera Větrného štítu.",
      type: "zbraň",
      slot: "hlavní ruka",
      rarity: "legendary",
      icon: "Zap",
      weaponType: "pěsti",
      allowedClasses: ["Mnich"],
      attack_bonus: 3,
      damageDice: "1d8",
      synergyClass: "Mnich",
      synergySkillId: "monk_flurry_of_blows",
      specialEffect: "Příval ran (Flurry of Blows) nestojí žádné AP (0 AP), pokud mnich v minulém tahu uhnul nebo odrazil střelu.",
      sell_price: 175,
      stats: "Útok +3, 1d8 Blesk, Příval ran stojí 0 AP po úspěšném úhybu"
    },
    {
      id: "art_monk_robe",
      name: "Róba vnitřního klidu",
      desc: "Jednoduchý mnišský oděv z hrubého lnu, který čistí tělo od všech jedů a chladu.",
      type: "zbroj",
      slot: "hruď",
      rarity: "legendary",
      icon: "Shirt",
      armorType: "róba",
      allowedClasses: ["Mnich"],
      defense_bonus: 4,
      statusImmunities: ["poisoned", "frozen"],
      specialEffect: "Plná imunita vůči Otravě (🧪) a Zchlazení (❄️). +15 % šance na vyhnutí se útokům.",
      sell_price: 160,
      stats: "Obrana +4, Imunita: Jed a Zmrazení, Úhyb +15%"
    },
    {
      id: "art_monk_necklace",
      name: "Náhrdelník sta modliteb",
      desc: "Šňůra modlitebních korálků z posvátného santalového dřeva.",
      type: "doplněk",
      slot: "krk",
      rarity: "epic",
      icon: "HeartHandshake",
      allowedClasses: ["Mnich"],
      specialEffect: "Omračující úder (Stunning Strike) má o 1 kolo nižší cooldown a zasáhne i vedlejší cíl.",
      sell_price: 130,
      stats: "Omračující úder CD -1, Zasáhne i vedlejší cíl"
    },
    {
      id: "art_monk_belt",
      name: "Pás větrného proudu",
      desc: "Tkaný pás mnichů, který usnadňuje rotaci těla při kopech.",
      type: "doplněk",
      slot: "prsten",
      rarity: "epic",
      icon: "Wind",
      allowedClasses: ["Mnich"],
      specialEffect: "Kop hurikánu odhodí nepřátele a sebere jim 1 AP navíc v dalším kole.",
      sell_price: 120,
      stats: "Kop hurikánu odebere nepřátelům 1 AP navíc"
    }
  ],

  "Druid": [
    {
      id: "art_druid_staff",
      name: "Žezlo živoucího hvozdu",
      desc: "Zkroucená dubová větev, na které neustále raší čerstvé listí a trny.",
      type: "zbraň",
      slot: "obouruční",
      rarity: "legendary",
      icon: "Activity",
      weaponType: "hůl",
      allowedClasses: ["Druid"],
      attack_bonus: 3,
      damageDice: "1d8",
      synergyClass: "Druid",
      synergySkillId: "druid_wild_shape",
      specialEffect: "V Medvědí podobě druid automaticky kolem sebe šíří trny, které udělí 6 poškození každému útočníkovi.",
      sell_price: 175,
      stats: "Kouzlení +3, Medvědí podoba šíří zraňující trny"
    },
    {
      id: "art_druid_armor",
      name: "Krunýř z prastarého železodřeva",
      desc: "Vytvarovaný z kůry stromů starších než lidská civilizace. Pevnější než ocel, ale zcela z přírody.",
      type: "zbroj",
      slot: "hruď",
      rarity: "legendary",
      icon: "Shield",
      armorType: "střední",
      allowedClasses: ["Druid"],
      defense_bonus: 4,
      resistances: { poison: 0.7, bleed: 0.5 },
      statusImmunities: ["poisoned"],
      specialEffect: "Plná imunita vůči Otravě (🧪) a 50% odolnost proti krvácení. Žádný kov!",
      sell_price: 165,
      stats: "Obrana +4, Imunita: Otrava, Železo-dřevo (přírodní)"
    },
    {
      id: "art_druid_amulet",
      name: "Amulet čtyř ročních období",
      desc: "Kulatý kamenný medailon s jantarem, v němž je zaklet list, sněhová vločka, kapka deště a sluneční paprsek.",
      type: "doplněk",
      slot: "krk",
      rarity: "epic",
      icon: "Sun",
      allowedClasses: ["Druid"],
      specialEffect: "Každé 2. kolo vyvolá přírodní vír, který vyléčí druida o 8 HP a zraní všechny nepřátele za 5 dmg.",
      sell_price: 135,
      stats: "Každé 2. kolo léčí za 8 HP a zraňuje všechny za 5 dmg"
    },
    {
      id: "art_druid_ring",
      name: "Prsten divokého volání",
      desc: "Vyřezaný z rohu jelena, vyzařuje prastarou energii hvozdu.",
      type: "doplněk",
      slot: "prsten",
      rarity: "epic",
      icon: "Activity",
      allowedClasses: ["Druid"],
      specialEffect: "Medvědí podoba trvá o 2 kola déle a přidává dalších +25 dočasných HP.",
      sell_price: 120,
      stats: "Medvědí podoba trvá +2 kola, +25 dočasných HP"
    }
  ],

  "Hraničář": [
    {
      id: "art_ranger_bow",
      name: "Luk větrného běžce",
      desc: "Vyrobený z pružného tisu a zpevněný stříbrem elfských mistrů. Šípy vystřelené z něj sviští rychlostí vichřice.",
      type: "zbraň",
      slot: "obouruční",
      rarity: "legendary",
      icon: "Crosshair",
      weaponType: "luk",
      allowedClasses: ["Hraničář"],
      attack_bonus: 3,
      damageDice: "1d10",
      synergyClass: "Hraničář",
      synergySkillId: "ranger_volley",
      specialEffect: "Krupobití šípů (Volley) aplikuje Značku lovce na VŠECHNY zasažené nepřátele.",
      sell_price: 180,
      stats: "Útok +3, 1d10 Fyz., Krupobití šípů označí všechny terče"
    },
    {
      id: "art_ranger_jacket",
      name: "Bunda ze stínové usně",
      desc: "Měkká kůže ještěra z bažin, která ztlumí každý zvuk kroků a chrání před jedem i šípy.",
      type: "zbroj",
      slot: "hruď",
      rarity: "legendary",
      icon: "Shield",
      armorType: "lehká",
      allowedClasses: ["Hraničář"],
      defense_bonus: 3,
      resistances: { poison: 0.6, bleed: 0.4 },
      statusImmunities: ["poisoned"],
      specialEffect: "Plná imunita vůči Otravě. Nepřátelé na dálku mají postih -3 k hodu na útok na hraničáře.",
      sell_price: 165,
      stats: "Obrana +3, Imunita: Jed, Krytí proti střelám -3"
    },
    {
      id: "art_ranger_amulet",
      name: "Lovecký medailon šelmy",
      desc: "Stříbrný vlk se smaragdovýma očima, který zostřuje smysly při lovu kořisti.",
      type: "doplněk",
      slot: "krk",
      rarity: "epic",
      icon: "Target",
      allowedClasses: ["Hraničář"],
      specialEffect: "Zabití označeného nepřítele okamžitě obnoví hraničáři 2 AP a 15 HP.",
      sell_price: 135,
      stats: "Zabití označeného cíle vrátí 2 AP a 15 HP"
    },
    {
      id: "art_ranger_quiver",
      name: "Tulec nekonečného větru",
      desc: "Kouzelný kožený tulec, který nikdy nevypotřebuje šípy s kaleným hrotem.",
      type: "doplněk",
      slot: "prsten",
      rarity: "epic",
      icon: "Crosshair",
      allowedClasses: ["Hraničář"],
      attack_bonus: 2,
      specialEffect: "Průrazný šíp způsobí hluboké Krvácení (2 stacky 🩸 po 4 dmg/kolo).",
      sell_price: 120,
      stats: "Útok +2, Průrazný šíp dává 2 stacky Krvácení"
    }
  ],

  "Čaroděj": [
    {
      id: "art_sorc_amulet",
      name: "Amulet nespoutaného chaosu",
      desc: "Planoucí drahokam s proměnlivými barvami, který ztělesňuje nepředvídatelnou moc divoké magie.",
      type: "doplněk",
      slot: "krk",
      rarity: "legendary",
      icon: "Sparkles",
      allowedClasses: ["Čaroděj"],
      attack_bonus: 3,
      synergyClass: "Čaroděj",
      synergySkillId: "sorc_chaos_orb",
      specialEffect: "Koule chaosu (Chaos Orb) vystřelí vždy dva projektily různých elementů současně.",
      sell_price: 180,
      stats: "Kouzlení +3, Koule chaosu vystřelí 2 projektily naráz"
    },
    {
      id: "art_sorc_robe",
      name: "Róba z šupin rudého draka",
      desc: "Zářivě rudý oděv pošitý dračími šupinami. Zcela ignoruje jakýkoliv plamen a zvyšuje sílu ohnivých kouzel.",
      type: "zbroj",
      slot: "hruď",
      rarity: "legendary",
      icon: "Flame",
      armorType: "róba",
      allowedClasses: ["Čaroděj"],
      defense_bonus: 4,
      resistances: { fire: 0.75 },
      statusImmunities: ["burning"],
      specialEffect: "Plná imunita vůči Hoření (🔥). Ohnivá kouzla působí o 25 % vyšší zranění.",
      sell_price: 170,
      stats: "Obrana +4, Imunita: Hoření, Ohnivá kouzla +25%"
    },
    {
      id: "art_sorc_ring",
      name: "Prsten metamagické zásoby",
      desc: "Prsten s pulzujícím ametystem, který uchovává metamagická zřídla energie.",
      type: "doplněk",
      slot: "prsten",
      rarity: "epic",
      icon: "Zap",
      allowedClasses: ["Čaroděj"],
      specialEffect: "Schopnost Zrychlené kouzlo lze použít dvakrát za boj bez cooldownu.",
      sell_price: 130,
      stats: "Zrychlené kouzlo lze použít 2x za boj"
    },
    {
      id: "art_sorc_wand",
      name: "Hůlka bouřné erupce",
      desc: "Vyřezaná z bleskem zasaženého jaspisu, který srší elektrickými výboji.",
      type: "zbraň",
      slot: "hlavní ruka",
      rarity: "epic",
      icon: "Zap",
      weaponType: "hůlka",
      allowedClasses: ["Čaroděj"],
      attack_bonus: 2,
      damageDice: "1d6",
      specialEffect: "Plamenná vlna a Meteorický pád mají 40% šanci omráčit (💫) zasažené nepřátele.",
      sell_price: 135,
      stats: "Kouzlení +2, Plošná kouzla mají 40% šanci na Omráčení"
    }
  ]
};

// Bázové šablony zbraní pro generování Common / Uncommon / Rare
export const BASE_WEAPON_TEMPLATES: Record<string, { name: string; slot: EquipSlot; weaponType: string; dice: string; icon: string }> = {
  "dyka": { name: "Ocelová dýka", slot: "hlavní ruka", weaponType: "dýka", dice: "1d4", icon: "Swords" },
  "kratky_mec": { name: "Krátký meč", slot: "hlavní ruka", weaponType: "krátký meč", dice: "1d6", icon: "Swords" },
  "dlouhy_mec": { name: "Dlouhý meč", slot: "hlavní ruka", weaponType: "jednoruční", dice: "1d8", icon: "Swords" },
  "sekera": { name: "Bojová sekera", slot: "hlavní ruka", weaponType: "sekera", dice: "1d8", icon: "Axe" },
  "kladivo": { name: "Válečné kladivo", slot: "hlavní ruka", weaponType: "kladivo", dice: "1d8", icon: "Hammer" },
  "palcat": { name: "Okovaný palcát", slot: "hlavní ruka", weaponType: "palcát", dice: "1d6", icon: "Hammer" },
  "obourucni_mec": { name: "Obouruční meč", slot: "obouruční", weaponType: "obouruční", dice: "2d6", icon: "Swords" },
  "velka_sekera": { name: "Obouruční válečná sekera", slot: "obouruční", weaponType: "obouruční", dice: "1d12", icon: "Axe" },
  "kratky_luk": { name: "Krátký lovecký luk", slot: "obouruční", weaponType: "luk", dice: "1d6", icon: "Crosshair" },
  "dlouhy_luk": { name: "Dlouhý kompozitní luk", slot: "obouruční", weaponType: "luk", dice: "1d8", icon: "Crosshair" },
  "lehka_kuse": { name: "Lehká samostřílná kuše", slot: "obouruční", weaponType: "kuše", dice: "1d8", icon: "Crosshair" },
  "tezka_kuse": { name: "Těžká obléhací kuše", slot: "obouruční", weaponType: "kuše", dice: "1d10", icon: "Crosshair" },
  "hul": { name: "Okouzlující jasanová hůl", slot: "obouruční", weaponType: "hůl", dice: "1d6", icon: "Wand" },
  "hulka": { name: "Rychlá arkánní hůlka", slot: "hlavní ruka", weaponType: "hůlka", dice: "1d4", icon: "Wand" },
  "loutna": { name: "Zdobená cestovní loutna", slot: "obouruční", weaponType: "loutna", dice: "1d6", icon: "Sparkles" }
};

// Bázové šablony zbrojí
export const BASE_ARMOR_TEMPLATES: Record<string, { name: string; slot: EquipSlot; armorType: string; ac: number; icon: string }> = {
  "roba": { name: "Učednická plátěná róba", slot: "hruď", armorType: "róba", ac: 1, icon: "Shirt" },
  "lehka_kuze": { name: "Vycpaná kožená vesta", slot: "hruď", armorType: "lehká", ac: 2, icon: "Shirt" },
  "stredni_krouzky": { name: "Kroužková košile", slot: "hruď", armorType: "střední", ac: 3, icon: "Shield" },
  "stredni_supiny": { name: "Šupinová zbroj", slot: "hruď", armorType: "střední", ac: 4, icon: "Shield" },
  "tezka_platovka": { name: "Kovaná plátová zbroj", slot: "hruď", armorType: "těžká", ac: 5, icon: "Shield" },
  "maly_stit": { name: "Okrouhlý dřevěný štít", slot: "druhá ruka", armorType: "štít", ac: 2, icon: "Shield" },
  "velky_stit": { name: "Ocelový věžový štít", slot: "druhá ruka", armorType: "štít", ac: 3, icon: "Shield" }
};

// Bázové šablony šperků
export const BASE_ACCESSORY_TEMPLATES: Record<string, { name: string; slot: EquipSlot; icon: string }> = {
  "prsten_zelezo": { name: "Železný ochranný prsten", slot: "prsten", icon: "Ring" },
  "prsten_stribro": { name: "Stříbrný prsten vitality", slot: "prsten", icon: "Ring" },
  "amulet_kamen": { name: "Kamenosošný amulet", slot: "krk", icon: "ShieldAlert" },
  "amulet_jantar": { name: "Jantarový medailon", slot: "krk", icon: "Sparkles" }
};
