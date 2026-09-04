import { create } from 'zustand';

export function normalizeQuestTitle(title: string): string {
  if (!title) return '';
  return String(title)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function isSameQuest(a: any, b: any): boolean {
  if (!a || !b) return false;
  if (a.id && b.id && a.id === b.id) return true;
  const normA = normalizeQuestTitle(a.nazev || a.title || '');
  const normB = normalizeQuestTitle(b.nazev || b.title || '');
  return Boolean(normA && normB && normA === normB);
}

export function deduplicateQuests(questList: any[]): any[] {
  if (!Array.isArray(questList)) return [];
  const result: any[] = [];

  for (const q of questList) {
    if (!q || (!q.id && !q.nazev)) continue;
    const existingIdx = result.findIndex(item => isSameQuest(item, q));

    if (existingIdx === -1) {
      const normTitle = normalizeQuestTitle(q.nazev || '');
      result.push({
        ...q,
        id: q.id || (normTitle ? `quest_${normTitle}` : `quest_${Math.random().toString(36).substring(2, 9)}`),
        nazev: q.nazev || 'Neznámý úkol',
        popis: q.popis || '',
        stav: q.stav || 'aktivni',
      });
    } else {
      const existing = result[existingIdx];
      const isCompleted = q.stav === 'splněno' || q.stav === 'splneno' || existing.stav === 'splněno' || existing.stav === 'splneno';
      const isFailed = !isCompleted && (q.stav === 'selhání' || q.stav === 'selhani' || existing.stav === 'selhání' || existing.stav === 'selhani');

      result[existingIdx] = {
        ...existing,
        ...q,
        id: existing.id || q.id,
        nazev: (q.nazev && q.nazev.length >= (existing.nazev?.length || 0)) ? q.nazev : existing.nazev,
        popis: (q.popis && q.popis.length >= (existing.popis?.length || 0)) ? q.popis : existing.popis,
        stav: isCompleted ? 'splněno' : (isFailed ? 'selhání' : (q.stav || existing.stav || 'aktivni')),
      };
    }
  }

  return result;
}

export function autoEquipItems(inventory: any[], currentEquipped?: any): Record<string, string | null> {
  const equipped: Record<string, string | null> = {
    "hlava": null,
    "hruď": null,
    "hlavní ruka": null,
    "druhá ruka": null,
    "prsten": null,
    "krk": null,
    ...(currentEquipped || {})
  };

  if (!Array.isArray(inventory)) return equipped;

  const validItemIds = new Set(inventory.filter(Boolean).map(i => i.id));
  for (const slot of Object.keys(equipped)) {
    if (equipped[slot] && !validItemIds.has(equipped[slot])) {
      equipped[slot] = null;
    }
  }

  const equippedVals = new Set(Object.values(equipped).filter(Boolean));

  // 1. Main hand weapon: slot == 'hlavní ruka' or type == 'zbraň'
  if (!equipped["hlavní ruka"]) {
    const weapon = inventory.find(i => 
      i && !equippedVals.has(i.id) &&
      (i.slot === "hlavní ruka" || i.type === "zbraň")
    );
    if (weapon) {
      equipped["hlavní ruka"] = weapon.id;
      equippedVals.add(weapon.id);
    }
  }

  // 2. Chest armor: slot == 'hruď' or (type == 'zbroj' and slot != 'druhá ruka')
  if (!equipped["hruď"]) {
    const armor = inventory.find(i => 
      i && !equippedVals.has(i.id) &&
      (i.slot === "hruď" || (i.type === "zbroj" && i.slot !== "druhá ruka"))
    );
    if (armor) {
      equipped["hruď"] = armor.id;
      equippedVals.add(armor.id);
    }
  }

  // 3. Shield / Off-hand: slot == 'druhá ruka' or icon == 'Shield'
  if (!equipped["druhá ruka"]) {
    const offhand = inventory.find(i => 
      i && !equippedVals.has(i.id) &&
      (i.slot === "druhá ruka" || (i.icon === "Shield" && i.type === "zbroj"))
    );
    if (offhand) {
      equipped["druhá ruka"] = offhand.id;
      equippedVals.add(offhand.id);
    }
  }

  // 4. Helmet: slot == 'hlava'
  if (!equipped["hlava"]) {
    const helmet = inventory.find(i => 
      i && !equippedVals.has(i.id) &&
      i.slot === "hlava"
    );
    if (helmet) {
      equipped["hlava"] = helmet.id;
      equippedVals.add(helmet.id);
    }
  }

  // 5. Ring: slot == 'prsten' or icon == 'Ring'
  if (!equipped["prsten"]) {
    const ring = inventory.find(i => 
      i && !equippedVals.has(i.id) &&
      (i.slot === "prsten" || i.icon === "Ring")
    );
    if (ring) {
      equipped["prsten"] = ring.id;
      equippedVals.add(ring.id);
    }
  }

  // 6. Necklace: slot == 'krk' or slot == 'amulet'
  if (!equipped["krk"]) {
    const necklace = inventory.find(i => 
      i && !equippedVals.has(i.id) &&
      (i.slot === "krk" || i.slot === "amulet")
    );
    if (necklace) {
      equipped["krk"] = necklace.id;
      equippedVals.add(necklace.id);
    }
  }

  return equipped;
}

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
  maxHp: number;
  setMaxHp: (maxHp: number | ((h: number) => number)) => void;
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
  
  // Session Game State
  history: any[];
  setHistory: (h: any[] | ((prev: any[]) => any[])) => void;
  suggestedActions: string[];
  setSuggestedActions: (actions: string[]) => void;
  pointsOfInterest: any[];
  setPointsOfInterest: (pois: any[]) => void;
  currentLocationImage: string | null;
  setCurrentLocationImage: (img: string | null) => void;
  currentLocationDesc: string;
  setCurrentLocationDesc: (desc: string) => void;
  currentImage: string | null;
  setCurrentImage: (img: string | null) => void;
  
  // Map and World
  day: number;
  setDay: (d: number | ((d: number) => number)) => void;
  playerLocation: {q: number, r: number} | null;
  setPlayerLocation: (loc: {q: number, r: number} | null) => void;
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
  setEnemies: (e: any[] | ((prev: any[]) => any[])) => void;
  combatLog: string[];
  setCombatLog: (log: string[] | ((prev: string[]) => string[])) => void;
  combatAp: number;
  setCombatAp: (ap: number | ((ap: number) => number)) => void;
  combatRound: number;
  setCombatRound: (r: number | ((r: number) => number)) => void;
  
  // Audio
  bgVolume: number;
  setBgVolume: (v: number) => void;
  ttsVolume: number;
  setTtsVolume: (v: number) => void;
  ttsProvider: "elevenlabs" | "edge";
  setTtsProvider: (p: "elevenlabs" | "edge") => void;
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
  maxHp: 100,
  setMaxHp: (maxHp) => set((state) => ({ maxHp: typeof maxHp === "function" ? maxHp(state.maxHp) : maxHp })),
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

  history: [],
  setHistory: (history) => set((state) => ({ history: typeof history === 'function' ? history(state.history) : history })),
  suggestedActions: [],
  setSuggestedActions: (suggestedActions) => set({ suggestedActions }),
  pointsOfInterest: [],
  setPointsOfInterest: (pointsOfInterest) => set({ pointsOfInterest }),
  currentLocationImage: null,
  setCurrentLocationImage: (currentLocationImage) => set({ currentLocationImage }),
  currentLocationDesc: "",
  setCurrentLocationDesc: (currentLocationDesc) => set({ currentLocationDesc }),
  currentImage: null,
  setCurrentImage: (currentImage) => set({ currentImage }),
  
  day: 1,
  setDay: (d) => set((state) => ({ day: typeof d === 'function' ? d(state.day) : d })),
  playerLocation: null,
  setPlayerLocation: (loc) => set({ playerLocation: loc }),
  worldData: null,
  journal: [],
  setJournal: (journal) => set((state) => ({ journal: typeof journal === 'function' ? journal(state.journal) : journal })),
  quests: [],
  setQuests: (quests) => set((state) => {
    const raw = typeof quests === 'function' ? quests(state.quests) : quests;
    return { quests: deduplicateQuests(raw) };
  }),
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
  setEnemies: (enemies) => set((state) => ({ enemies: typeof enemies === 'function' ? enemies(state.enemies) : enemies })),
  combatLog: [],
  setCombatLog: (combatLog) => set((state) => ({ combatLog: typeof combatLog === 'function' ? combatLog(state.combatLog) : combatLog })),
  combatAp: 3,
  setCombatAp: (combatAp) => set((state) => ({ combatAp: typeof combatAp === 'function' ? combatAp(state.combatAp) : combatAp })),
  combatRound: 1,
  setCombatRound: (combatRound) => set((state) => ({ combatRound: typeof combatRound === 'function' ? combatRound(state.combatRound) : combatRound })),

  bgVolume: 0.2,
  setBgVolume: (bgVolume) => set({ bgVolume }),
  ttsVolume: 1.0,
  setTtsVolume: (ttsVolume) => set({ ttsVolume }),
  ttsProvider: (typeof window !== "undefined" && (localStorage.getItem("aethelgard_tts_provider") as any)) || "elevenlabs",
  setTtsProvider: (ttsProvider) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aethelgard_tts_provider", ttsProvider);
    }
    set({ ttsProvider });
  },
  currentTrack: '/music/theme.mp3',
  setCurrentTrack: (currentTrack) => set({ currentTrack }),
  musicPlaying: true,
  unreadQuests: false,
  setUnreadQuests: (unreadQuests) => set((state) => ({ unreadQuests: typeof unreadQuests === "function" ? unreadQuests(state.unreadQuests) : unreadQuests })),
  setMusicPlaying: (musicPlaying) => set({ musicPlaying }),
}));
