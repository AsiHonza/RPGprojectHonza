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
  trait: RaceTrait;
}

export const RACES: Record<string, RaceConfig> = {
  "Člověk": {
    name: "Člověk",
    bonuses: { str: 1, dex: 1, con: 1, intel: 1, wis: 1, cha: 1 },
    trait: { id: "human_versatility", name: "Zdolnost", description: "+1 Akční bod (AP) na začátku boje.", type: "passive_ap" }
  },
  "Elf": {
    name: "Elf",
    bonuses: { dex: 2, intel: 1 },
    trait: { id: "elven_agility", name: "Bystré smysly", description: "+1 k Obraně (AC).", type: "passive_ac" }
  },
  "Trpaslík": {
    name: "Trpaslík",
    bonuses: { con: 2, str: 1 },
    trait: { id: "dwarven_toughness", name: "Trpasličí houževnatost", description: "Sníží každé fyzické zranění o 1. +5 k max HP.", type: "passive_defense" }
  },
  "Půlčík": {
    name: "Půlčík",
    bonuses: { dex: 2, cha: 1 },
    trait: { id: "halfling_luck", name: "Štístko", description: "Při hodu 1 na útok automaticky házíš znovu.", type: "passive_reroll" }
  },
  "Drakorozený": {
    name: "Drakorozený",
    bonuses: { str: 2, cha: 1 },
    trait: { id: "dragon_breath", name: "Dračí dech", description: "Plošné zranění ohněm všem nepřátelům (Cooldown 3 kola).", type: "active_skill" }
  },
  "Tiefling": {
    name: "Tiefling",
    bonuses: { cha: 2, intel: 1 },
    trait: { id: "hellish_rebuke", name: "Pekelná odplata", description: "Když utržíš zranění nablízko, vrátíš útočníkovi 2 body poškození.", type: "passive_thorns" }
  },
  "Půlork": {
    name: "Půlork",
    bonuses: { str: 2, con: 1 },
    trait: { id: "relentless_endurance", name: "Nezdolná vytrvalost", description: "Jednou za boj tě fatální rána nezabije, ale zanechá tě na 1 HP.", type: "passive_undying" }
  },
  "Gnóm": {
    name: "Gnóm",
    bonuses: { intel: 2, dex: 1 },
    trait: { id: "gnome_cunning", name: "Technomagický štít", description: "25% šance zcela ignorovat zranění vyšší než 5.", type: "passive_dodge" }
  }
};

