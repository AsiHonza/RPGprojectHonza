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
  setHp: (hp: number | ((h: number) => number)) => void;
  level: number;
  setLevel: (l: number | ((l: number) => number)) => void;
  xp: number;
  setXp: (x: number | ((x: number) => number)) => void;
  gold: number;
  setGold: (gold: number) => void;
  rations: number;
  setRations: (r: number | ((r: number) => number)) => void;
  skillPoints: number;
  setSkillPoints: (s: number | ((s: number) => number)) => void;
  
  // Inventory
  inventory: any[];
  setInventory: (inv: any[] | ((inv: any[]) => any[])) => void;
  equipped: any;
  setEquipped: (eq: any) => void;
  
  // Map and World
  worldData: any;
  journal: string[];
  setJournal: (journal: string[] | ((prev: string[]) => string[])) => void;
  quests: any[];
  setQuests: (quests: any[] | ((prev: any[]) => any[])) => void;
  npcs: any[];
  setNpcs: (npcs: any[] | ((prev: any[]) => any[])) => void;
  setWorldData: (data: any) => void;
  currentRegion: string;
  setCurrentRegion: (r: string) => void;
  locationType: string;
  setLocationType: (l: string) => void;
  
  // Magic
  currentSpellSlots: number;
  setCurrentSpellSlots: (s: number | ((s: number) => number)) => void;
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
  // Audio
  bgVolume: number;
  setBgVolume: (v: number) => void;
  ttsVolume: number;
  setTtsVolume: (v: number) => void;
  currentTrack: string;
  setCurrentTrack: (t: string) => void;
  musicPlaying: boolean;
  unreadQuests: boolean;
  setUnreadQuests: (u: boolean | ((u: boolean) => boolean)) => void;
  setMusicPlaying: (p: boolean) => void;
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
  setHp: (hp) => set((state) => ({ hp: typeof hp === "function" ? hp(state.hp) : hp })),
  level: 1,
  setLevel: (level) => set((state) => ({ level: typeof level === "function" ? level(state.level) : level })),
  xp: 0,
  setXp: (xp) => set((state) => ({ xp: typeof xp === "function" ? xp(state.xp) : xp })),
  gold: 15,
  setGold: (gold) => set({ gold }),
  rations: 3,
  setRations: (rations) => set((state) => ({ rations: typeof rations === "function" ? rations(state.rations) : rations })),
  skillPoints: 0,
  setSkillPoints: (skillPoints) => set((state) => ({ skillPoints: typeof skillPoints === "function" ? skillPoints(state.skillPoints) : skillPoints })),

  inventory: [],
  setInventory: (inventory) => set((state) => ({ inventory: typeof inventory === "function" ? inventory(state.inventory) : inventory })),
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
  journal: [],
  setJournal: (journal) => set((state) => ({ journal: typeof journal === 'function' ? journal(state.journal) : journal })),
  quests: [],
  setQuests: (quests) => set((state) => ({ quests: typeof quests === 'function' ? quests(state.quests) : quests })),
  npcs: [],
  setNpcs: (npcs) => set((state) => ({ npcs: typeof npcs === 'function' ? npcs(state.npcs) : npcs })),
  setWorldData: (worldData) => set({ worldData }),
  currentRegion: "Neznámé končiny",
  setCurrentRegion: (currentRegion) => set({ currentRegion }),
  locationType: "divocina",
  setLocationType: (locationType) => set({ locationType }),

  currentSpellSlots: 0,
  setCurrentSpellSlots: (currentSpellSlots) => set((state) => ({ currentSpellSlots: typeof currentSpellSlots === "function" ? currentSpellSlots(state.currentSpellSlots) : currentSpellSlots })),
  maxSpellSlots: 0,
  setMaxSpellSlots: (maxSpellSlots) => set({ maxSpellSlots }),

  skills: [],
  setSkills: (skills) => set({ skills }),
  availableSkills: [],
  setAvailableSkills: (availableSkills) => set({ availableSkills }),

  inCombat: false,
  setInCombat: (inCombat) => set({ inCombat }),
  enemies: [],
  bgVolume: 0.2,
  setBgVolume: (bgVolume) => set({ bgVolume }),
  ttsVolume: 1.0,
  setTtsVolume: (ttsVolume) => set({ ttsVolume }),
  currentTrack: '/ambient.mp3',
  setCurrentTrack: (currentTrack) => set({ currentTrack }),
  musicPlaying: true,
  unreadQuests: false,
  setUnreadQuests: (unreadQuests) => set((state) => ({ unreadQuests: typeof unreadQuests === "function" ? unreadQuests(state.unreadQuests) : unreadQuests })),
  setMusicPlaying: (musicPlaying) => set({ musicPlaying }),
  setEnemies: (enemies) => set({ enemies }),
}));
