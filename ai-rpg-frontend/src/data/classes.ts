export type StatKey = "str" | "dex" | "con" | "intel" | "wis" | "cha";

export interface ClassConfig {
  name: string;
  baseStats: Record<StatKey, number>;
}

// Map the Standard Array (15, 14, 13, 12, 10, 8) according to class strengths.
export const CLASSES: Record<string, ClassConfig> = {
  "Barbar": { name: "Barbar", baseStats: { str: 15, con: 14, dex: 13, wis: 12, intel: 10, cha: 8 } },
  "Bard": { name: "Bard", baseStats: { cha: 15, dex: 14, con: 13, intel: 12, wis: 10, str: 8 } },
  "Klerik": { name: "Klerik", baseStats: { wis: 15, con: 14, str: 13, dex: 12, cha: 10, intel: 8 } },
  "Druid": { name: "Druid", baseStats: { wis: 15, dex: 14, con: 13, intel: 12, cha: 10, str: 8 } },
  "Bojovník": { name: "Bojovník", baseStats: { str: 15, dex: 14, con: 13, intel: 12, wis: 10, cha: 8 } },
  "Mnich": { name: "Mnich", baseStats: { dex: 15, wis: 14, con: 13, str: 12, intel: 10, cha: 8 } },
  "Paladin": { name: "Paladin", baseStats: { str: 15, cha: 14, con: 13, wis: 12, dex: 10, intel: 8 } },
  "Hraničář": { name: "Hraničář", baseStats: { dex: 15, wis: 14, con: 13, str: 12, intel: 10, cha: 8 } },
  "Tulák": { name: "Tulák", baseStats: { dex: 15, intel: 14, con: 13, cha: 12, wis: 10, str: 8 } },
  "Čaroděj": { name: "Čaroděj", baseStats: { cha: 15, con: 14, dex: 13, wis: 12, intel: 10, str: 8 } },
  "Černokněžník": { name: "Černokněžník", baseStats: { cha: 15, con: 14, dex: 13, wis: 12, intel: 10, str: 8 } },
  "Kouzelník": { name: "Kouzelník", baseStats: { intel: 15, dex: 14, con: 13, wis: 12, cha: 10, str: 8 } }
};

