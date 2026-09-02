import { create } from 'zustand';

interface GameState {
  // Application UI State
  gameState: "menu" | "creation" | "playing";
  setGameState: (state: "menu" | "creation" | "playing") => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
  
  // Character Creation Form
  name: string;
  setName: (n: string) => void;
  dndClass: string;
  setDndClass: (c: string) => void;
  race: string;
  setRace: (r: string) => void;
  stats: { str: number; dex: number; con: number; intel: number; wis: number; cha: number };
  setStats: (s: any) => void;
  keywords: string;
  setKeywords: (k: string) => void;
  gameMode: string;
  setGameMode: (m: string) => void;
  backstory: any;
  setBackstory: (b: any) => void;

  // RPG Stats
  hp: number;
  setHp: (hp: number) => void;
  level: number;
  setLevel: (l: number) => void;
  xp: number;
  setXp: (x: number) => void;
  gold: number;
  setGold: (gold: number) => void;
  rations: number;
  setRations: (r: number) => void;
  skillPoints: number;
  setSkillPoints: (s: number) => void;
  
  // Inventory
  inventory: any[];
  setInventory: (inv: any[]) => void;
  equipped: any;
  setEquipped: (eq: any) => void;
  
  // Map and World
  worldData: any;
  setWorldData: (data: any) => void;
  currentRegion: string;
  setCurrentRegion: (r: string) => void;
  locationType: string;
  setLocationType: (l: string) => void;
  
  // Magic
  currentSpellSlots: number;
  setCurrentSpellSlots: (s: number) => void;
  maxSpellSlots: number;
  setMaxSpellSlots: (s: number) => void;

  // Skills
  skills: any[];
  setSkills: (s: any[]) => void;
  availableSkills: any[];
  setAvailableSkills: (s: any[]) => void;

  // Combat
  inCombat: boolean;
  setInCombat: (c: boolean) => void;
  enemies: any[];
  setEnemies: (e: any[]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameState: "menu",
  setGameState: (state) => set({ gameState: state }),
  loading: false,
  setLoading: (loading) => set({ loading }),

  name: "",
  setName: (name) => set({ name }),
  dndClass: "Bojovník",
  setDndClass: (dndClass) => set({ dndClass }),
  race: "Člověk",
  setRace: (race) => set({ race }),
  stats: { str: 15, dex: 14, con: 13, intel: 12, wis: 10, cha: 8 },
  setStats: (stats) => set({ stats }),
  keywords: "",
  setKeywords: (keywords) => set({ keywords }),
  gameMode: "sandbox",
  setGameMode: (gameMode) => set({ gameMode }),
  backstory: null,
  setBackstory: (backstory) => set({ backstory }),

  hp: 100,
  setHp: (hp) => set({ hp }),
  level: 1,
  setLevel: (level) => set({ level }),
  xp: 0,
  setXp: (xp) => set({ xp }),
  gold: 15,
  setGold: (gold) => set({ gold }),
  rations: 3,
  setRations: (rations) => set({ rations }),
  skillPoints: 0,
  setSkillPoints: (skillPoints) => set({ skillPoints }),

  inventory: [],
  setInventory: (inventory) => set({ inventory }),
  equipped: {
    "hlava": null,
    "hruď": null,
    "hlavní ruka": null,
    "druhá ruka": null,
    "prsten": null,
    "krk": null
  },
  setEquipped: (equipped) => set({ equipped }),

  worldData: null,
  setWorldData: (worldData) => set({ worldData }),
  currentRegion: "Neznámé končiny",
  setCurrentRegion: (currentRegion) => set({ currentRegion }),
  locationType: "divocina",
  setLocationType: (locationType) => set({ locationType }),

  currentSpellSlots: 0,
  setCurrentSpellSlots: (currentSpellSlots) => set({ currentSpellSlots }),
  maxSpellSlots: 0,
  setMaxSpellSlots: (maxSpellSlots) => set({ maxSpellSlots }),

  skills: [],
  setSkills: (skills) => set({ skills }),
  availableSkills: [],
  setAvailableSkills: (availableSkills) => set({ availableSkills }),

  inCombat: false,
  setInCombat: (inCombat) => set({ inCombat }),
  enemies: [],
  setEnemies: (enemies) => set({ enemies }),
}));
