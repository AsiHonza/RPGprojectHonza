import { create } from 'zustand';

interface GameState {
  // Application UI State
  gameState: "menu" | "creation" | "playing";
  setGameState: (state: "menu" | "creation" | "playing") => void;
  
  // Character Data
  name: string;
  dndClass: string;
  race: string;
  stats: { str: number; dex: number; con: number; intel: number; wis: number; cha: number };
  hp: number;
  level: number;
  xp: number;
  gold: number;
  rations: number;
  
  // Inventory
  inventory: any[];
  equipped: any;
  
  // Map and World
  worldData: any;
  currentRegion: string;
  locationType: string;
  
  // Actions
  setHp: (hp: number) => void;
  setGold: (gold: number) => void;
  setInventory: (inv: any[]) => void;
  setEquipped: (eq: any) => void;
  setWorldData: (data: any) => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameState: "menu",
  setGameState: (state) => set({ gameState: state }),

  name: "",
  dndClass: "Bojovník",
  race: "Člověk",
  stats: { str: 15, dex: 14, con: 13, intel: 12, wis: 10, cha: 8 },
  hp: 100,
  level: 1,
  xp: 0,
  gold: 15,
  rations: 3,

  inventory: [],
  equipped: {
    "hlava": null,
    "hruď": null,
    "hlavní ruka": null,
    "druhá ruka": null,
    "prsten": null,
    "krk": null
  },

  worldData: null,
  currentRegion: "Neznámé končiny",
  locationType: "divocina",

  setHp: (hp) => set({ hp }),
  setGold: (gold) => set({ gold }),
  setInventory: (inventory) => set({ inventory }),
  setEquipped: (equipped) => set({ equipped }),
  setWorldData: (worldData) => set({ worldData })
}));
