export type StatKey = "str" | "dex" | "con" | "intel" | "wis" | "cha";
export type TraitType = "passive_ap" | "passive_ac" | "passive_defense" | "passive_reroll" | "active_skill" | "passive_thorns" | "passive_undying" | "passive_dodge";

export interface RaceTrait {
  id: string;
  name: string;
  description: string;
  type: TraitType;
}

export interface RaceConfig {
  name: string;
  bonuses: Partial<Record<StatKey, number>>;
  displayBonuses: string;
  trait: RaceTrait;
  passivesList: string[];
  lore: string;
}

export const RACES: Record<string, RaceConfig> = {
  "Člověk": {
    name: "Člověk",
    bonuses: { str: 1, dex: 1, con: 1, intel: 1, wis: 1, cha: 1 },
    displayBonuses: "+1 ke všem 6 atributům",
    trait: { id: "human_versatility", name: "Lidská houževnatost", description: "+1 Akční bod (AP) na začátku boje (celkem 4 AP na tah).", type: "passive_ap" },
    passivesList: [
      "+1 ke všem 6 atributům (všestranný rozvoj)",
      "+1 Akční bod (AP) v boji (4 AP celkem)",
      "Vysoká adaptabilita na jakékoliv povolání"
    ],
    lore: "Nejpočetnější a nejctižádostivější rasa Aelthgardu. Staví velká města, vedou obchodní cechy a dokáží se přizpůsobit jakémukoliv řemeslu."
  },
  "Elf": {
    name: "Elf",
    bonuses: { dex: 2, intel: 1 },
    displayBonuses: "+2 Obratnost, +1 Inteligence",
    trait: { id: "elven_agility", name: "Bystré smysly & Mrštnost", description: "+1 k Obraně (AC) a přirozená odolnost proti magickému spánku.", type: "passive_ac" },
    passivesList: [
      "+2 Obratnost, +1 Inteligence",
      "+1 k Obraně (AC) díky bleskovým reflexům",
      "Temnocit a odolnost vůči omráčení"
    ],
    lore: "Dlouhověcí strážci Hlubokých hvozdů a prastarých svatyní. Vládnou vytříbenou elegancí, vrozenou magickou intuicí a smrtící muškou s lukem."
  },
  "Trpaslík": {
    name: "Trpaslík",
    bonuses: { con: 2, str: 1 },
    displayBonuses: "+2 Odolnost, +1 Síla",
    trait: { id: "dwarven_toughness", name: "Trpasličí houževnatost", description: "Sníží každé utržené fyzické zranění o 1. Trvalý bonus +5 k maximálnímu HP.", type: "passive_defense" },
    passivesList: [
      "+2 Odolnost, +1 Síla",
      "+5 k maximálnímu zdraví (Max HP)",
      "Redukce každého fyzického poškození o 1",
      "Vrozená odolnost vůči jedům a toxinům"
    ],
    lore: "Nezlomní kováři a válečníci z horských pevností Železného Prahu. Jejich těla jsou tvrdá jako žula a jejich přísaha platí na věky."
  },
  "Půlčík": {
    name: "Půlčík",
    bonuses: { dex: 2, cha: 1 },
    displayBonuses: "+2 Obratnost, +1 Charisma",
    trait: { id: "halfling_luck", name: "Štístko (Halfling Luck)", description: "Při hodu 1 na útok automaticky házíš znovu a vyhneš se fatálnímu selhání.", type: "passive_reroll" },
    passivesList: [
      "+2 Obratnost, +1 Charisma",
      "Přehazování kritického neúspěchu (hod 1 na útok)",
      "Přirozený sklon k tichému plížení a smlouvání"
    ],
    lore: "Veselí, nenápadní a neobyčejně šťastní tvorové ze Svobodných měst a usedlostí. Dokáží vyváznout z každé šlamastyky s úsměvem."
  },
  "Drakorozený": {
    name: "Drakorozený",
    bonuses: { str: 2, cha: 1 },
    displayBonuses: "+2 Síla, +1 Charisma",
    trait: { id: "dragon_breath", name: "Dračí dech (Aktivní)", description: "Vychrlí plošnou vlnu ohně na všechny nepřátele v boji (Cooldown 3 kola, 2 AP).", type: "active_skill" },
    passivesList: [
      "+2 Síla, +1 Charisma",
      "Aktivní schopnost Dračí dech (Plošný oheň na všechny)",
      "Odolnost proti ohnivému zranění"
    ],
    lore: "Hrdí válečníci nesoucí krev prastarých draků. Jejich šupinatá kůže a majestátní vystupování vzbuzují respekt na každém bojišti."
  },
  "Tiefling": {
    name: "Tiefling",
    bonuses: { cha: 2, intel: 1 },
    displayBonuses: "+2 Charisma, +1 Inteligence",
    trait: { id: "hellish_rebuke", name: "Pekelná odplata (Thorns)", description: "Když utržíš zranění nablízko, pekelné plameny vrátí útočníkovi 2 body zranění.", type: "passive_thorns" },
    passivesList: [
      "+2 Charisma, +1 Inteligence",
      "Pekelné trny (2 odvetná poškození při zasažení)",
      "Vrozená spřízněnost s temnou a stínovou magií"
    ],
    lore: "Potomci pradávných paktů se stínovými bytostmi. Přestože na ně mnozí hledí s podezřením, jejich charisma a ohnivá magie jsou neocenitelné."
  },
  "Půlork": {
    name: "Půlork",
    bonuses: { str: 2, con: 1 },
    displayBonuses: "+2 Síla, +1 Odolnost",
    trait: { id: "relentless_endurance", name: "Nezdolná vytrvalost", description: "Jednou za boj tě smrtelná rána nezabije, ale zanechá tě stát s 1 HP.", type: "passive_undying" },
    passivesList: [
      "+2 Síla, +1 Odolnost",
      "Záchrana před smrtí (přežití na 1 HP jednou za boj)",
      "Divošské kritické údery s těžkými zbraněmi"
    ],
    lore: "Zrozeni na divokých hranicích mezi civilizací a pustinou. Spojují lidský důvtip s divokou, nezastavitelnou silou orčích předků."
  },
  "Gnóm": {
    name: "Gnóm",
    bonuses: { intel: 2, dex: 1 },
    displayBonuses: "+2 Inteligence, +1 Obratnost",
    trait: { id: "gnome_cunning", name: "Technomagický štít", description: "25% šance zcela ignorovat a odrazit jakékoliv zranění vyšší než 5.", type: "passive_dodge" },
    passivesList: [
      "+2 Inteligence, +1 Obratnost",
      "25% šance na odražení silných útoků",
      "Mistr vynálezů, alchymie a magických rébusů"
    ],
    lore: "Geniální alchymisté, inženýři a učenci z Tajemného útočiště. Jejich vynalézavá mysl vidí řešení tam, kde ostatní vidí jen zkázu."
  }
};

