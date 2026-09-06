"use client";

import HexMap from "../components/map/HexMap";
import { motion } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from "react";
import { useGameStore, isSameQuest, normalizeQuestTitle, deduplicateQuests, autoEquipItems } from '../store/gameStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

import { ItemIcon } from '../components/ui/ItemIcon';
import { InventoryPanel } from '../features/character/InventoryPanel';
import { DeathModal } from '../features/character/DeathModal';
import ReactPlayer from 'react-player';
import { Send, Heart, Flame, Package, Sword, Shield, FlaskConical, Gem, Shirt, ScrollText, X, Volume2, VolumeX, User, Users, Settings2, Map, Sparkles, Skull, BookOpen, MapPin, Drumstick, Mail, Loader2, Trash2 , Brain , Menu, RotateCcw, ShoppingBag, Target, Sun, Moon } from "lucide-react";
import { CharacterCreation } from '../features/character/CharacterCreation';
import { MapModal } from '../features/map/MapModal';
import { QuestsModal } from '../features/character/QuestsModal';
import { JournalModal } from '../features/character/JournalModal';
import { NpcsModal } from '../features/character/NpcsModal';
import { SkillsModal } from '../features/character/SkillsModal';
import { StatsModal } from '../features/character/StatsModal';
import { SettingsModal } from '../features/ui/SettingsModal';
import { PatchNotesModal } from '../features/ui/PatchNotesModal';
import { CampModal } from '../features/character/CampModal';
import { TownServicesModal } from '../features/town/TownServicesModal';
import { DesktopSidePanel } from '../features/ui/DesktopSidePanel';
import { PlayerHeader } from '../features/ui/PlayerHeader';
import { CombatArena } from '../features/combat/CombatArena';
import { PATCH_NOTES } from '../data/patchNotes';
import { SeamlessVideo } from '../components/ui/SeamlessVideo';
import { CharacterCarousel } from '../components/character/CharacterCarousel';
import { audioManager } from '../services/audio/audioManager';
import { CURRENT_GAME_VERSION } from '../services/version/gameVersion';
import { AmbientBackground } from '../components/ui/AmbientBackground';

const getAvatarVideo = (r?: string) => {
  if (!r) return null;
  const lower = r.toLowerCase();
  const normalized = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (normalized.includes('clovek') || lower.includes('human')) return '/video/avatars/clovek.mp4';
  if (normalized.includes('trpasl') || lower.includes('dwarf')) return '/video/avatars/trpaslik.mp4';
  if (normalized.includes('drak') || lower.includes('dragon')) return '/video/avatars/drakorozeny.mp4';
  if (lower.includes('tiefling')) return '/video/avatars/tiefling.mp4';
  if (normalized.includes('ork') || lower.includes('orc')) return '/video/avatars/pulork.mp4';
  if (normalized.includes('pulcik') || lower.includes('halfling')) return '/video/avatars/pulcik.mp4';
  if (normalized.includes('gnom') || lower.includes('gnome')) return '/video/avatars/gnom.mp4';
  if (normalized.includes('elf')) return '/video/avatars/elf.mp4';
  return null;
};

const TypewriterText = ({ text, delay = 25, animate = false }: { text: string, delay?: number, animate?: boolean }) => {
  const [displayedText, setDisplayedText] = useState(animate ? "" : text);


  useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      return;
    }
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, delay);
    return () => clearInterval(interval);
  }, [text, animate, delay]);

  return <span>{displayedText}</span>;
};


// Helper component to colorize system logs
const FormattedSystemLog = ({ text }: { text: string }) => {
    const lines = text.split('\n').map((line, idx) => {
      let html = line
        .replace(/(Kritický úspěch!|Kritický úspěch|Kritický úspěch\.)/gi, '<span class="text-green-700 dark:text-green-400 font-bold uppercase tracking-wider">$1</span>')
        .replace(/(Kritické selhání!|Kritické selhání|Kritický neúspěch)/gi, '<span class="text-red-500 dark:text-red-400 font-bold uppercase tracking-wider">$1</span>')
        .replace(/(?<!\p{L})(Úspěch\.|Úspěch!|Úspěch:?)/giu, '<span class="text-green-700 dark:text-green-400 font-bold">$1</span>')
        .replace(/(?<!\p{L})(Selhání\.|Selhání!|Selhání:?|Neúspěch\.|Neúspěch!|Neúspěch:?)/giu, '<span class="text-red-700 dark:text-red-400 font-bold">$1</span>')
        .replace(/(Hráč ztrácí \d+ HP|ztrácí \d+ HP|způsobuje \d+ bodů poškození|Ztrácí \d+ HP)/gi, '<span class="text-red-700 dark:text-red-400 font-bold">$1</span>')
        .replace(/(d\d+\(\d+\))/g, '<span class="text-amber-700 dark:text-amber-400 font-bold">$1</span>')
        .replace(/(\d+ vs DC \d+)/g, '<span class="text-amber-700 dark:text-amber-400 font-bold">$1</span>')
        .replace(/(vs AC \d+)/g, '<span class="text-amber-700 dark:text-amber-400 font-bold">$1</span>')
        .replace(/(Útok vlka|Útok nepřítele|Útok skřeta|Útok orka)/gi, '<span class="text-red-700 dark:text-red-400 font-bold">$1</span>')
        .replace(/(Útok hráče.*?:)/gi, '<span class="text-green-700 dark:text-green-400 font-bold">$1</span>')
        .replace(/(Zásah!)/g, '<span class="font-bold border-b border-red-400 text-red-700 dark:text-red-400">$1</span>')
        .replace(/(Hod na .*?:)/gi, '<span class="text-rpg-magic dark:text-amber-300 font-bold">$1</span>')
        .replace(/(Aktivní akce:)/gi, '<span class="text-blue-600 dark:text-blue-400 font-bold">$1</span>')
        .replace(/(Výsledek:)/gi, '<span class="text-slate-900 dark:text-slate-200 font-bold">$1</span>');
      
      return (
        <div key={idx} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: html }} />
      );
    });
    return <div className="font-mono text-sm text-slate-800 dark:text-[#d1c7b7] leading-relaxed bg-[#f9f6e6]/60 dark:bg-[#0c1119]/80 p-4 rounded-xl border border-amber-900/10 dark:border-amber-500/15 shadow-inner mt-2">{lines}</div>;
  };



const isFemale = (p?: string) => {
  const normalized = (p || "").trim().toLowerCase().replace(/ž/g, "z");
  return normalized === "zena" || normalized === "female";
};

export default function Home() {
  const { 
    bgVolume, setBgVolume, currentTrack, setCurrentTrack, ttsVolume, setTtsVolume, ttsProvider, setTtsProvider, 
    musicPlaying, setMusicPlaying, unreadQuests, setUnreadQuests, gameState, setGameState, loading, setLoading, 
    name, setName, dndClass, setDndClass, race, setRace, stats, setStats, keywords, setKeywords, gameMode, setGameMode, 
    backstory, setBackstory, hp, setHp, maxHp, setMaxHp, level, setLevel, xp, setXp, gold, setGold, rations, setRations, 
    skillPoints, setSkillPoints, inventory, setInventory, equipped, setEquipped, worldData, setWorldData, journal, setJournal, 
    quests, setQuests, pinnedQuestId, setPinnedQuestId, npcs, setNpcs, currentRegion, setCurrentRegion, locationType, setLocationType, currentSpellSlots, 
    setCurrentSpellSlots, maxSpellSlots, setMaxSpellSlots, skills, setSkills, availableSkills, setAvailableSkills, 
    inCombat, setInCombat, enemies, setEnemies, playerLocation, setPlayerLocation, day, setDay, history, setHistory, 
    suggestedActions, setSuggestedActions, pointsOfInterest, setPointsOfInterest, currentLocationImage, setCurrentLocationImage, 
    currentLocationDesc, setCurrentLocationDesc, currentImage, setCurrentImage, combatLog, setCombatLog, reputation, setReputation, 
    updateReputation, chronicle, setChronicle, worldFlags, setWorldFlags, consequenceToast, setConsequenceToast,
    activeBuffs, addBuff, activeMount, setActiveMount, resetCharacterCreation,
    theme, setTheme
  } = useGameStore();

  const isDark = theme === 'dark' || (theme === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const activeTrackedQuest = useMemo(() => {
    if (!quests || !Array.isArray(quests) || quests.length === 0) return null;
    const activeList = quests.filter(q => q.stav === 'aktivni' || (!q.stav?.includes('spln') && !q.stav?.includes('selh')));
    if (pinnedQuestId) {
      const found = quests.find(q => q.id === pinnedQuestId);
      if (found && (found.stav === 'aktivni' || (!found.stav?.includes('spln') && !found.stav?.includes('selh')))) {
        return found;
      }
    }
    return activeList[0] || null;
  }, [quests, pinnedQuestId]);

  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsub = audioManager.subscribeSpeaking(setIsSpeaking);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (gameState !== "playing") {
      audioManager.stopTts();
    }
  }, [gameState]);

  const [actionsOpen, setActionsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Character Creation Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Game Play State
  const [savedCharacters, setSavedCharacters] = useState<any[]>([]);
      const [customAction, setCustomAction] = useState("");
  // Central Modal Manager State
  type ActiveModalType = 'inventory' | 'map' | 'journal' | 'quests' | 'npcs' | 'skills' | 'stats' | 'settings' | 'patchNotes' | 'camp' | 'town_services' | null;
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);

  const inventoryOpen = activeModal === 'inventory';
  const setInventoryOpen = (open: boolean) => setActiveModal(open ? 'inventory' : null);

  const journalOpen = activeModal === 'journal';
  const setJournalOpen = (open: boolean) => setActiveModal(open ? 'journal' : null);

  const settingsOpen = activeModal === 'settings';
  const setSettingsOpen = (open: boolean) => setActiveModal(open ? 'settings' : null);

  const patchNotesOpen = activeModal === 'patchNotes';
  const setPatchNotesOpen = (open: boolean) => setActiveModal(open ? 'patchNotes' : null);

  const skillsOpen = activeModal === 'skills';
  const setSkillsOpen = (open: boolean) => setActiveModal(open ? 'skills' : null);

  const statsOpen = activeModal === 'stats';
  const setStatsOpen = (open: boolean) => setActiveModal(open ? 'stats' : null);

  const questsOpen = activeModal === 'quests';
  const setQuestsOpen = (open: boolean) => setActiveModal(open ? 'quests' : null);

  const npcsOpen = activeModal === 'npcs';
  const setNpcsOpen = (open: boolean) => setActiveModal(open ? 'npcs' : null);

  const mapOpen = activeModal === 'map';
  const setMapOpen = (open: boolean) => setActiveModal(open ? 'map' : null);

  const campOpen = activeModal === 'camp';
  const setCampOpen = (open: boolean) => setActiveModal(open ? 'camp' : null);

  const townServicesOpen = activeModal === 'town_services';
  const setTownServicesOpen = (open: boolean) => setActiveModal(open ? 'town_services' : null);

  const [isOOC, setIsOOC] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [heroDropdownOpen, setHeroDropdownOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const [travelMode, setTravelMode] = useState(false);
  const [travelDaysLeft, setTravelDaysLeft] = useState(0);
  const [travelDestination, setTravelDestination] = useState("");


      const [currentImageError, setCurrentImageError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [questBanner, setQuestBanner] = useState<{title: string, subtitle: string} | null>(null);
  
  const prevQuestsRef = useRef(quests);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (typeof document !== 'undefined') {
      document.body.scrollLeft = 0;
      document.documentElement.scrollLeft = 0;
    }
  }, [gameState]);

  useEffect(() => {
    const prev = prevQuestsRef.current;
    if (prev.length > 0 || quests.length > 0) {
      if (JSON.stringify(prev) !== JSON.stringify(quests)) {
        const newQuest = quests.find(q => !prev.some(pq => isSameQuest(pq, q)));
        if (newQuest) {
           setUnreadQuests(true);
           setQuestBanner({title: "ÚKOL PŘIJAT", subtitle: newQuest.nazev});
        } else {
           const completedQuest = quests.find(q => (q.stav === 'splněno' || q.stav === 'splneno') && prev.some(pq => isSameQuest(pq, q) && pq.stav !== 'splněno' && pq.stav !== 'splneno'));
           if (completedQuest) {
              setUnreadQuests(true);
              setQuestBanner({title: "ÚKOL SPLNĚN", subtitle: completedQuest.nazev});
           } else {
              const hadChanges = prev.length !== quests.length || 
                quests.some(q => {
                  const matching = prev.find(pq => isSameQuest(pq, q));
                  return !matching || matching.stav !== q.stav || matching.popis !== q.popis;
                });
              if (hadChanges) {
                setUnreadQuests(true);
                setQuestBanner({title: "DENÍK ÚKOLŮ AKTUALIZOVÁN", subtitle: ""});
              }
           }
        }
        setTimeout(() => setQuestBanner(null), 3500);
      }
    }
    prevQuestsRef.current = quests;
  }, [quests]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const bgAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const isFullCaster = ["Wizard", "Sorcerer", "Cleric", "Druid", "Bard"].includes(dndClass);
    const isHalfCaster = ["Paladin", "Ranger"].includes(dndClass);
    const isThirdCaster = ["Warlock"].includes(dndClass);
    let slots = 0;
    if (isFullCaster) slots = level === 1 ? 2 : level === 2 ? 3 : level >= 3 ? 4 : 2;
    else if (isHalfCaster && level >= 2) slots = 2;
    else if (isThirdCaster) slots = level >= 2 ? 2 : 1;
    
    if (slots > maxSpellSlots) {
        setCurrentSpellSlots(prev => prev + (slots - maxSpellSlots));
        setMaxSpellSlots(slots);
    }
  }, [level, dndClass, maxSpellSlots]);
  

  // Sync gameState to URL hash
  useEffect(() => {
    if (gameState) {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash !== gameState) {
        window.history.pushState(null, '', `#${gameState}`);
      }
    }
  }, [gameState]);

  // Handle browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'creation' && isLoggedIn) {
        setGameState('creation');
      } else if (hash === 'playing' && isLoggedIn) {
        // Can only go back to playing if we have an active character
        const savedChar = localStorage.getItem("aethelgard_active_char");
        if (savedChar) setGameState('playing');
        else setGameState('menu');
      } else {
        setGameState('menu');
      }
    };
    window.addEventListener('popstate', handlePopState);
    
    // Initial sync on mount
    if (isLoggedIn) {
      handlePopState();
    }
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isLoggedIn, setGameState]);
  // Global interaction listener for Autoplay Policy
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (musicPlaying && bgAudioRef.current) {
        bgAudioRef.current.volume = bgVolume;
        bgAudioRef.current.play().then(() => {
          window.removeEventListener('click', handleFirstInteraction);
          window.removeEventListener('touchstart', handleFirstInteraction);
          window.removeEventListener('keydown', handleFirstInteraction);
        }).catch(e => {
          console.log("Autoplay waiting for allowed gesture:", e);
        });
      }
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [musicPlaying, bgVolume]);

  // Dynamic Music switching
  useEffect(() => {
    if (!musicPlaying || !bgAudioRef.current) return;
    
    let newTrack = "/music/theme.mp3";
    
    if (gameState === "menu" || gameState === "creation") {
      newTrack = "/music/theme.mp3";
    } else {
      if (inCombat) {
        newTrack = "/music/combat1.mp3";
      } else {
        if (locationType === "mesto") newTrack = "/music/city1.mp3";
        else if (locationType === "podzemi" || locationType === "dungeon") newTrack = "/music/wilds2.mp3";
        else if (locationType === "divocina") newTrack = "/music/wilds1.mp3";
        else newTrack = "/music/city1.mp3";
      }
    }

    if (newTrack !== currentTrack) {
      const audio = bgAudioRef.current;
      
      // Crossfade OUT
      let outVol = audio.volume;
      const fadeOut = setInterval(() => {
        if (outVol > 0.05) {
          outVol -= 0.05;
          audio.volume = Math.max(0, outVol);
        } else {
          clearInterval(fadeOut);
          audio.pause();
          setCurrentTrack(newTrack);
          
          // Wait for React to render new src, then play and fade IN
          setTimeout(() => {
            audio.volume = 0;
            audio.play().then(() => {
              let inVol = 0;
              const fadeIn = setInterval(() => {
                if (inVol < bgVolume - 0.05) {
                  inVol += 0.05;
                  audio.volume = Math.min(bgVolume, inVol);
                } else {
                  audio.volume = bgVolume;
                  clearInterval(fadeIn);
                }
              }, 150);
            }).catch(e => { console.error("Audio crossfade blocked", e); audio.volume = bgVolume; });
          }, 100);
        }
      }, 150);
    }
  }, [locationType, inCombat, musicPlaying, gameState, currentTrack, bgVolume]);

  // Audio control effect
  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = bgVolume;
      if (musicPlaying) {
        bgAudioRef.current.play().catch(e => console.error("Audio block:", e));
      } else {
        bgAudioRef.current.pause();
      }
    }
  }, [musicPlaying, bgVolume, currentTrack]);

  const classes = ["Barbar", "Bard", "Klerik", "Druid", "Bojovník", "Mnich", "Paladin", "Hraničář", "Tulák", "Čaroděj", "Černokněžník", "Kouzelník"];
  const races = ["Člověk", "Elf", "Trpaslík", "Půlčík", "Drakorozený", "Tiefling", "Půlork", "Gnóm"];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Standard Array logic
  useEffect(() => {
    if (!dndClass) return;
    // Basic auto-assignment of Standard Array (15, 14, 13, 12, 10, 8) based on class
    const assign = (primary: string, secondary: string, tertiary: string) => {
      const base = { str: 8, dex: 8, con: 8, intel: 8, wis: 8, cha: 8 };
      base[primary as keyof typeof base] = 15;
      base[secondary as keyof typeof base] = 14;
      base[tertiary as keyof typeof base] = 13;
      // fill rest
      const remaining = ["str", "dex", "con", "intel", "wis", "cha"].filter(k => k !== primary && k !== secondary && k !== tertiary);
      base[remaining[0] as keyof typeof base] = 12;
      base[remaining[1] as keyof typeof base] = 10;
      return base;
    };

    switch(dndClass) {
      case "Barbar": case "Barbarian": setStats(assign("str", "con", "dex")); break;
      case "Bojovník": case "Fighter": setStats(assign("str", "con", "dex")); break;
      case "Tulák": case "Rogue": setStats(assign("dex", "intel", "cha")); break;
      case "Kouzelník": case "Wizard": setStats(assign("intel", "con", "dex")); break;
      case "Klerik": case "Cleric": setStats(assign("wis", "con", "str")); break;
      case "Bard": setStats(assign("cha", "dex", "con")); break;
      case "Hraničář": case "Ranger": setStats(assign("dex", "wis", "con")); break;
      case "Paladin": setStats(assign("str", "cha", "con")); break;
      case "Čaroděj": case "Sorcerer": setStats(assign("cha", "con", "dex")); break;
      case "Černokněžník": case "Warlock": setStats(assign("cha", "con", "dex")); break;
      case "Druid": setStats(assign("wis", "con", "dex")); break;
      case "Mnich": case "Monk": setStats(assign("dex", "wis", "con")); break;
      default: setStats(assign("str", "dex", "con")); break;
    }
  }, [dndClass]);

  // Autosave
  useEffect(() => {
    if (gameState !== "playing" || !email || !name) return;
    const timer = setTimeout(() => {
      fetch(`${API_URL}/save-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          name: name,
          state: {
            hp, max_hp: maxHp, inventory, equipped, level, xp, skillPoints, skills, inCombat, enemies, quests,
            locationType, currentRegion, pointsOfInterest, stats, rations, currentImage, currentImageError, currentLocationDesc,
            travel_mode: travelMode, travel_days_left: travelDaysLeft, travel_destination: travelDestination,
            zname_postavy: npcs, world_data: worldData, playerLocation: playerLocation,
            gold, currentSpellSlots, maxSpellSlots, activeBuffs, activeMount, reputation, chronicle, worldFlags, day,
            version: CURRENT_GAME_VERSION
          }
        }),
      }).catch(err => console.error("Autosave failed", err));
    }, 2000);
    return () => clearTimeout(timer);
  }, [hp, maxHp, inventory, equipped, level, xp, skillPoints, skills, inCombat, enemies, quests, locationType, currentRegion, pointsOfInterest, gameState, stats, gold, currentSpellSlots, maxSpellSlots, rations, currentImage, currentImageError, travelMode, travelDaysLeft, travelDestination, npcs, worldData, playerLocation, activeBuffs, activeMount, reputation, chronicle, worldFlags, day]);

  const playAudio = (text: string, voiceType: "narrator" | "npc_muz" | "npc_zena" = "narrator"): Promise<void> => {
    return audioManager.playSingleTts(API_URL, text, voiceType, ttsProvider, ttsVolume);
  };

  const playAudioSequentially = async (texts: {text: string, type: "narrator" | "npc_muz" | "npc_zena"}[]) => {
    await audioManager.playSequence(API_URL, texts, ttsProvider, ttsVolume);
  };

  const generateBackstory = async () => {
    if (!name || !name.trim()) return alert("Nejprve zadejte jméno postavy v kroku 2!");
    if (!keywords || !keywords.trim()) return alert("Zadejte alespoň několik klíčových slov o minulosti postavy!");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate-backstory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          api_key: "DUMMY", 
          name: name.trim(), 
          race: race || "Člověk", 
          dnd_class: dndClass || "Bojovník", 
          keywords: keywords.trim() 
        }),
      });
      if (res.ok) {
        setBackstory(await res.json());
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.detail || "Chyba při generování pozadí postavy.");
      }
    } catch (err) {
      alert("Chyba připojení k serveru.");
    }
    setLoading(false);
  };

    const handleAuth = async (isRegister: boolean) => {
    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Authentication failed");
      
      setIsLoggedIn(true);
      localStorage.setItem("aethelgard_session_email", email);
      fetchCharacters(email);
    } catch (error: any) {
      alert("Chyba přihlášení: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCharacters = async (userEmail = email) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/list-characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setSavedCharacters(data.characters);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const savedEmail = localStorage.getItem("aethelgard_session_email");
    const savedChar = localStorage.getItem("aethelgard_active_char");
    
    if (savedEmail) {
      setEmail(savedEmail);
      setIsLoggedIn(true);
      fetchCharacters(savedEmail);
      
      if (savedChar) {
        // Auto resume game!
        loadGame(savedChar, savedEmail);
      }
    }
  }, []);


  const deleteCharacter = async (e: any, characterName: string) => {
    e.stopPropagation();
    if (!confirm(`Opravdu chceš smazat postavu ${characterName}? Tato akce je nevratná.`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/delete-character`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: characterName })
      });
      if (!res.ok) throw new Error("Nepodařilo se smazat postavu.");
      fetchCharacters(email);
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  const formatError = (detail: any, fallback = "Došlo k neočekávané chybě.") => {
    if (!detail) return fallback;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((d: any) => {
        const field = d.loc ? d.loc.filter((x: any) => x !== "body").join(".") : "";
        const msg = d.msg || (typeof d === "object" ? JSON.stringify(d) : String(d));
        return field ? `${field}: ${msg}` : msg;
      }).join("\n");
    }
    if (typeof detail === "object") {
      if (detail.message) return detail.message;
      return JSON.stringify(detail);
    }
    return String(detail);
  };

  const loadGame = async (characterName: string, overrideEmail: string = email) => {
    if (!overrideEmail || !characterName) return alert("Přihlaste se a vyberte postavu!");
    audioManager.stopTts();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/load-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: overrideEmail, api_key: "DUMMY", name: characterName }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setName(data.character.name);
        setRace(data.character.race);
        setDndClass(data.character.dnd_class);
        
        // Parsování historie
        let lastSuggestedActions: string[] = [];
        let lastAudioQueue: {text: string, type: "narrator" | "npc_muz" | "npc_zena"}[] = [];

        const loadedHistory = (data.character.history || []).map((msg: any) => {
          if (!msg) return null;
          if (msg.role === "user" || msg.type === "player") {
            return { type: "player", text: msg.text || msg.content || "" };
          }
          if (msg.role === "assistant" || msg.role === "model" || msg.type === "dm") {
            const rawText = msg.text || msg.content;
            if (!rawText) return null;

            try {
              const dm_data = typeof rawText === "string" ? JSON.parse(rawText) : rawText;
              
              if (dm_data && typeof dm_data === "object") {
                if (dm_data.nabizene_akce) {
                  lastSuggestedActions = dm_data.nabizene_akce;
                }

                lastAudioQueue = [];
                if (dm_data.vypravec) {
                  lastAudioQueue.push({ text: dm_data.vypravec, type: "narrator" });
                }
                if (dm_data.npc_dialogy && Array.isArray(dm_data.npc_dialogy)) {
                  for (const npc of dm_data.npc_dialogy) {
                    const npcText = npc.text || npc.replika;
                    if (npcText) {
                      lastAudioQueue.push({
                        text: npcText,
                        type: isFemale(npc.pohlavi) ? "npc_zena" : "npc_muz"
                      });
                    }
                  }
                }

                return { 
                  type: "dm", 
                  popis_okoli: dm_data.popis_okoli,
                  image_prompt: dm_data.image_prompt,
                  vypravec: dm_data.vypravec || "",
                  system_log: dm_data.system_log,
                  npc_dialogy: dm_data.npc_dialogy,
                  v_boji: dm_data.v_boji,
                  nepratele: dm_data.nepratele,
                  typ_lokace: dm_data.typ_lokace,
                  aktualni_region: dm_data.aktualni_region,
                  vyznamna_mista: dm_data.vyznamna_mista
                };
              }
              lastAudioQueue = [{ text: String(dm_data), type: "narrator" }];
              return { type: "dm", vypravec: String(dm_data) };
            } catch {
              // Graceful fallback for non-JSON string entries (like narrative plain text from travel or combat)
              if (typeof rawText === 'string' && rawText.trim()) {
                lastAudioQueue = [{ text: rawText.trim(), type: "narrator" }];
                return {
                  type: "dm",
                  vypravec: rawText
                };
              }
              return { type: "error", text: "Chybný formát zprávy z historie." };
            }
          }
          return null;
        }).filter(Boolean);
        
        // Ensure lastAudioQueue and lastSuggestedActions truly correspond to the final DM message in history
        const lastDmMsg = [...loadedHistory].reverse().find((m: any) => m && m.type === "dm");
        if (lastDmMsg) {
          const queue: {text: string, type: "narrator" | "npc_muz" | "npc_zena"}[] = [];
          if (lastDmMsg.vypravec) {
            queue.push({ text: lastDmMsg.vypravec, type: "narrator" });
          }
          if (lastDmMsg.npc_dialogy && Array.isArray(lastDmMsg.npc_dialogy)) {
            for (const npc of lastDmMsg.npc_dialogy) {
              const npcText = npc.text || npc.replika;
              if (npcText) {
                queue.push({
                  text: npcText,
                  type: isFemale(npc.pohlavi) ? "npc_zena" : "npc_muz"
                });
              }
            }
          }
          if (queue.length > 0) {
            lastAudioQueue = queue;
          }
        }

        setHistory(loadedHistory);
        setSuggestedActions(lastSuggestedActions);
        
        const state = data.character.state || {};
        setHp(state.hp || 100);
        setMaxHp(state.max_hp || 100);
        if (state.gold !== undefined) setGold(state.gold);
        if (state.currentSpellSlots !== undefined) setCurrentSpellSlots(state.currentSpellSlots);
        if (state.maxSpellSlots !== undefined) setMaxSpellSlots(state.maxSpellSlots);
        const loadedInv = state.inventory || [];
        setInventory(loadedInv);
        const resolvedEquipped = autoEquipItems(loadedInv, state.equipped);
        setEquipped(resolvedEquipped);
        
        
        setLevel(state.level || 1);
        setXp(state.xp || 0);
        setSkillPoints(state.skillPoints || 0);
        setSkills(state.skills || []);
        setAvailableSkills(state.available_skills || [
            {id: "silny_uder", name: "Silný úder", desc: "Základní útok nablízko se zvýšeným poškozením (Aktivní)"},
            {id: "ohniva_koule", name: "Ohnivá koule", desc: "Sešle zničující ohnivou kouli na cíl (Aktivní - Magie)"},
            {id: "plizeni", name: "Stínový krok", desc: "Postava se přesune do stínů a získá výhodu na další útok (Aktivní)"},
            {id: "lecive_slovo", name: "Léčivé slovo", desc: "Magicky obnoví trochu zdraví (Aktivní)"},
            {id: "odolnost", name: "Železná kůže", desc: "V boji tě je těžší zranit. (Pasivní)"},
            {id: "sermir", name: "Mistr meče", desc: "Vyšší šance na kritický zásah. (Pasivní)"}
        ]);
        setRations(state.rations ?? 3);
        setInCombat(state.inCombat || false);
        setEnemies(state.enemies || []);
        setQuests(deduplicateQuests(state.quests || []));
        setJournal(state.journal || []);
        if (data.character.stats) setStats(data.character.stats);
        if (state.locationType) setLocationType(state.locationType);
        if (state.currentRegion) setCurrentRegion(state.currentRegion);

        if (state.activeBuffs && Array.isArray(state.activeBuffs)) {
          state.activeBuffs.forEach((b: any) => addBuff(b));
        }
        if (state.activeMount !== undefined) setActiveMount(state.activeMount);
        if (state.reputation) setReputation(state.reputation);
        if (state.chronicle) setChronicle(state.chronicle);
        if (state.worldFlags) setWorldFlags(state.worldFlags);
        if (state.day !== undefined) setDay(state.day);

        if (state.travel_mode !== undefined) setTravelMode(state.travel_mode);
        if (state.travel_days_left !== undefined) setTravelDaysLeft(state.travel_days_left);
        if (state.travel_destination !== undefined) setTravelDestination(state.travel_destination);
        if (state.zname_postavy) setNpcs(state.zname_postavy);
        if (state.world_data) setWorldData(state.world_data);
        else setWorldData(null);

        let pLoc = state.playerLocation || state.player_location;
        if (!pLoc && state.world_data) {
          const cap = state.world_data.pois?.find((p: any) => p.type === "Capital") || state.world_data.pois?.[0];
          if (cap) {
            pLoc = { q: cap.q, r: cap.r, kingdom_id: cap.kingdom_id, biome: cap.terrain };
          } else if (state.world_data.hex_grid?.[0]) {
            const h = state.world_data.hex_grid[0];
            pLoc = { q: h.q, r: h.r, kingdom_id: h.kingdom_id, biome: h.terrain };
          }
        }
        if (pLoc) {
          setPlayerLocation(pLoc);
        }


        if (state.currentLocationDesc) setCurrentLocationDesc(state.currentLocationDesc);
        if (state.popis_okoli) setCurrentLocationDesc(state.popis_okoli);
        if (state.pointsOfInterest) setPointsOfInterest(state.pointsOfInterest);
        if (state.currentImage) setCurrentImage(state.currentImage.startsWith("http") && !state.currentImage.includes("127.0.0.1") ? state.currentImage : (state.currentImage.includes("127.0.0.1") ? state.currentImage.replace("http://127.0.0.1:8000", API_URL) : `${API_URL}${state.currentImage}`));
        if (state.currentImageError) setCurrentImageError(state.currentImageError);

        setGameState("playing");
        
          if (lastAudioQueue.length > 0) {
            playAudioSequentially(lastAudioQueue);
        }
      } else {
        alert(formatError(data.detail, "Chyba při načítání pozice."));
      }
    } catch (err) {
      console.error(err); alert("Chyba připojení k serveru.");
    }
    setLoading(false);
  };

  const startNewGame = async () => {
    if (!name || !name.trim()) return alert("Zadejte jméno!");
    setLoading(true);

    const userEmail = email || (typeof window !== 'undefined' ? localStorage.getItem("aethelgard_session_email") : "") || "hrac@aelthgard.com";

    let formattedBackstory = "";
    if (backstory) {
      if (typeof backstory === "string") {
        formattedBackstory = backstory;
      } else if (typeof backstory === "object") {
        formattedBackstory = [
          backstory.appearance ? `Vzhled: ${backstory.appearance}` : "",
          backstory.personality ? `Osobnost: ${backstory.personality}` : "",
          backstory.backstory ? `Příběh: ${backstory.backstory}` : ""
        ].filter(Boolean).join("\n\n");
      }
    }

    try {
      const res = await fetch(`${API_URL}/create-character`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          dnd_class: dndClass || "Bojovník", 
          race: race || "Člověk", 
          stats, 
          email: userEmail, 
          api_key: "DUMMY", 
          game_mode: gameMode || "campaign", 
          backstory: formattedBackstory 
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        // Load the character to fetch full state including generated world_data
        await loadGame(name, userEmail);
        
        // Ensure UI updates properly to playing state
        setGameState("playing");
        localStorage.setItem("aethelgard_active_char", name);
      } else {
        alert(formatError(data.detail, "Chyba při tvorbě postavy."));
      }
    } catch (e) {
      alert("Nelze se připojit k serveru.");
    }
    setLoading(false);
  };


  const handleTravel = async (q: number, r: number, targetHex?: any) => {
    audioManager.stopTts();
    // 1. Immediately close map and reset all stale local choices so they don't linger!
    setMapOpen(false);
    setLoading(true);
    setSuggestedActions([]);
    setPointsOfInterest([]);

    const destLabel = targetHex?.nazev || targetHex?.terrain || "Nová oblast";
    setHistory(prev => [...prev, { type: "player", text: `🗺️ Vydávám se na cestu: ${destLabel}` }]);

    try {
      const res = await fetch(`${API_URL}/travel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          name: name,
          target_q: q,
          target_r: r
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        if (data.state) {
          setPlayerLocation(data.state.playerLocation || data.state.player_location);
          if (data.state.day !== undefined) setDay(data.state.day);
          if (data.state.rations !== undefined) setRations(data.state.rations);
          if (data.state.hp !== undefined) setHp(data.state.hp);
        }

        if (data.aktivni_reputace) setReputation(data.aktivni_reputace);
        if (data.kronika) setChronicle(data.kronika);
        if (data.svetova_fakta) setWorldFlags(data.svetova_fakta);
        if (data.aktualni_region) setCurrentRegion(data.aktualni_region);
        if (data.typ_lokace) setLocationType(data.typ_lokace);
        if (data.vyznamna_mista) setPointsOfInterest(data.vyznamna_mista);
        else setPointsOfInterest([]);

        if (data.nabizene_akce && data.nabizene_akce.length > 0) {
          setSuggestedActions(data.nabizene_akce);
        } else {
          setSuggestedActions([
            `Prozkoumat oblast ${destLabel}`,
            "Rozdělat tábor a odpočinout si",
            "Připravit se k další cestě"
          ]);
        }
        
        // Push the narrative to history as DM entry with narrator text, environment description, and system log
        setHistory(prev => [...prev, { 
          type: "dm", 
          vypravec: data.narrative,
          popis_okoli: data.popis_okoli || `Oblast: ${data.terrain_name || 'Divočina'}`,
          system_log: data.system_log || null
        }]);

        if (data.image_prompt) {
          setCurrentLocationImage(`https://image.pollinations.ai/prompt/${encodeURIComponent(data.image_prompt)}?width=800&height=600&nologo=true`);
        }
        
        // Generate TTS audio for narrative
        if (data.narrative) {
          playAudio(data.narrative, "narrator");
        }
      } else {
        alert(formatError(data.detail, "Chyba při cestování."));
      }
    } catch (err) {
      console.error(err);
      setHistory(prev => [...prev, { type: "error", text: "Chyba spojení se serverem při cestování." }]);
    } finally {
      setLoading(false);
    }
  };
  const isResolvingCombatRef = useRef(false);
  const handleCombatResolution = async () => {
    audioManager.stopTts();
    if (isResolvingCombatRef.current) return;
    isResolvingCombatRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/resolve-combat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          name: name,
          api_key: "DUMMY",
          combat_log: combatLog,
          player_hp: hp,
          enemies: enemies,
          level: level
        })
      });
      const data = await res.json();
      if (res.ok) {
        setHistory(prev => [...prev, { 
          type: "dm", 
          vypravec: data.vypravec,
        }]);
        if (data.vypravec) {
          playAudioSequentially([{text: data.vypravec, type: "narrator"}]);
        }
        
        // Zmeny stavu are applied by the backend, we should refresh the character state
        // To be safe, we can trigger fetchCharacters for this character or update locally
        setInCombat(false);
        setEnemies([]);
        setCombatLog([]);
        
        // Refresh local state by pulling from backend
        const charRes = await fetch(`${API_URL}/load-game`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, name: name })
        });
        if (charRes.ok) {
          const charData = await charRes.json();
          const charState = charData.character?.state || charData.state;
          if (charState) {
            setHp(charState.hp ?? hp);
            setMaxHp(charState.maxHp ?? charState.max_hp ?? maxHp);
            setXp(charState.xp ?? xp);
            setGold(charState.gold ?? gold);
            setLevel(charState.level ?? level);
            if (charState.inventory) setInventory(charState.inventory);
          }
        }
      } else {
        setHistory(prev => [...prev, { type: "error", text: "Nepodařilo se ukončit boj na serveru." }]);
        setInCombat(false); // Failsafe
      }
    } catch (e) {
      console.error(e);
      setHistory(prev => [...prev, { type: "error", text: "Chyba sítě při ukončení boje." }]);
      setInCombat(false);
    } finally {
      setLoading(false);
    }
  };

  const sendAction = async (actionText: string) => {
    if (!actionText.trim() || loading) return;
    audioManager.stopTts();
    
    let finalActionText = actionText;
      if (isOOC) {
          finalActionText = `[OOC/MYŠLENKA] ${actionText}`;
      }
      setHistory(prev => [...prev, { type: "player", text: isOOC ? `🧠 ${actionText}` : actionText }]);
      setIsOOC(false);
    setCustomAction("");
    setSuggestedActions([]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email,
          api_key: "DUMMY", 
          name: name,
          action: finalActionText,
          action_text: finalActionText,
          stats: stats,
          level: level,
          skills: skills
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setHistory(prev => [...prev, { 
          type: "dm", 
          popis_okoli: data.popis_okoli,
          image_prompt: data.image_prompt,
          vypravec: data.vypravec,
          system_log: data.system_log || null,
          npc_dialogy: data.npc_dialogy || []
        }]);
        setSuggestedActions(data.nabizene_akce || []);
        
        // AUTO-PLAY
        const audioQueue: {text: string, type: "narrator"|"npc_muz"|"npc_zena"}[] = [];
        if (data.vypravec) audioQueue.push({text: data.vypravec, type: "narrator"});
        if (data.npc_dialogy && data.npc_dialogy.length > 0) {
            data.npc_dialogy.forEach((npc: any) => {
               const npcText = npc.text || npc.replika;
               if (npcText) {
                 const type = isFemale(npc.pohlavi) ? "npc_zena" : "npc_muz";
                 audioQueue.push({text: npcText, type});
               }
            });
        }
        if (audioQueue.length > 0) {
            playAudioSequentially(audioQueue);
        }
        
        // Update local state based on DM response
        if (data.image_prompt) setCurrentLocationImage(`https://image.pollinations.ai/prompt/${encodeURIComponent(data.image_prompt)}?width=800&height=600&nologo=true`);
        if (data.popis_okoli) setCurrentLocationDesc(data.popis_okoli);
        
        if (data.v_boji !== undefined) {
          setInCombat(data.v_boji);
          if (data.v_boji) setCombatLog([]);
        }

        if (data.zmeny_stavu) {
          if (data.zmeny_stavu.travel_mode_set !== undefined && data.zmeny_stavu.travel_mode_set !== null) setTravelMode(data.zmeny_stavu.travel_mode_set);
          if (data.zmeny_stavu.travel_days_left_set !== undefined && data.zmeny_stavu.travel_days_left_set !== null) setTravelDaysLeft(data.zmeny_stavu.travel_days_left_set);
          if (data.zmeny_stavu.travel_destination_set !== undefined && data.zmeny_stavu.travel_destination_set !== null) setTravelDestination(data.zmeny_stavu.travel_destination_set);

          if (data.zmeny_stavu.zname_postavy_zmena && data.zmeny_stavu.zname_postavy_zmena.length > 0) {
            setNpcs(prev => {
              const updated = [...prev];
              data.zmeny_stavu.zname_postavy_zmena.forEach((newNpc: any) => {
                const idx = updated.findIndex(n => n.jmeno.toLowerCase() === newNpc.jmeno.toLowerCase());
                if (idx !== -1) updated[idx] = newNpc;
                else updated.push(newNpc);
              });
              return updated;
            });
          }

        }

        // Update Living World & Memory state
        if (data.aktivni_reputace) setReputation(data.aktivni_reputace);
        else if (data.reputace_zmena) updateReputation(data.reputace_zmena);

        if (data.reputace_zmena && Object.keys(data.reputace_zmena).length > 0) {
          const [factionKey, rawVal] = Object.entries(data.reputace_zmena)[0];
          const val = Number(rawVal);
          const sign = (val > 0) ? '+' + val : String(val);
          setConsequenceToast({
            text: 'Reputace u frakce byla upravena: ' + sign,
            faction: factionKey,
            delta: val
          });
          setTimeout(() => setConsequenceToast(null), 5000);
        } else if (data.hex_mutace) {
          setConsequenceToast({
            text: 'Oblast byla trvale ovlivněna tvým činem! (' + (data.hex_mutace.popis || data.hex_mutace.stav || 'Změněno') + ')',
          });
          setTimeout(() => setConsequenceToast(null), 5000);
        }

        if (data.kronika) setChronicle(data.kronika);
        if (data.svetova_fakta) setWorldFlags(data.svetova_fakta);

        if (data.nepratele) setEnemies(data.nepratele);
        if (data.typ_lokace) setLocationType(data.typ_lokace);
        if (data.aktualni_region) setCurrentRegion(data.aktualni_region);
        if (data.vyznamna_mista) setPointsOfInterest(data.vyznamna_mista);
        if (data.image_url) setCurrentImage(data.image_url.startsWith("http") ? data.image_url : `${API_URL}${data.image_url}`);
        else if (data.image_base64) setCurrentImage(data.image_base64);
        if (data.image_error) setCurrentImageError(data.image_error);
        else if (data.image_url || data.image_base64) setCurrentImageError(null);

        if (data.zmeny_stavu) {
          if (data.zmeny_stavu.zivoty_zmena) setHp(h => Math.min(maxHp, Math.max(0, h + data.zmeny_stavu.zivoty_zmena)));
          if (data.zmeny_stavu.zlato_zmena) setGold(g => Math.max(0, g + data.zmeny_stavu.zlato_zmena));
          if (data.zmeny_stavu.xp_zmena) {
             setXp(currentXp => {
               const newXp = currentXp + data.zmeny_stavu.xp_zmena;
               const xpNeeded = level * 500;
               if (newXp >= xpNeeded) {
                 const nextLevel = level + 1;
                 const nextMaxHp = maxHp + 10;
                 setLevel(nextLevel);
                 setMaxHp(nextMaxHp);
                 setHp(nextMaxHp); // Full heal on level-up
                 const earnedPoints = nextLevel % 2 === 0 ? 2 : 1;
                  setSkillPoints(sp => sp + earnedPoints);
                 setQuestBanner({
                   title: `POSTOUPIL JSI NA ÚROVEŇ ${nextLevel}!`,
                   subtitle: `+10 Max HP (vyléčen na ${nextMaxHp} HP) a získal jsi ${earnedPoints} ${earnedPoints === 1 ? "dovednostní bod" : "dovednostní body"}!`
                 });
                 setTimeout(() => setQuestBanner(null), 7000);
                 return newXp - xpNeeded;
               }
               return newXp;
             });
          }
          
          if (data.zmeny_stavu.davky_jidla_zmena) {
             setRations(r => Math.max(0, r + data.zmeny_stavu.davky_jidla_zmena));
          }
          setInventory(inv => {
            let newInv = [...inv];
            if (data.zmeny_stavu.inventar_pridat) newInv.push(...data.zmeny_stavu.inventar_pridat);
            if (data.zmeny_stavu.inventar_odebrat_id) {
               newInv = newInv.filter(i => !data.zmeny_stavu.inventar_odebrat_id.includes(i.id));
               // If we remove an item, we also need to unequip it if it's equipped
               setEquipped((eq: any) => {
                  let newEq = { ...eq };
                  Object.keys(newEq).forEach(k => {
                     if (data.zmeny_stavu.inventar_odebrat_id.includes(newEq[k])) newEq[k] = null;
                  });
                  return newEq;
               });
            }
            return newInv;
          });
          
          if (data.zmeny_stavu.ukoly) {
             setQuests(prev => {
                const updated = [...prev];
                for (const u of data.zmeny_stavu.ukoly) {
                   const idx = updated.findIndex(existing => isSameQuest(existing, u));
                   if (idx !== -1) updated[idx] = { ...updated[idx], ...u };
                   else updated.push(u);
                }
                return deduplicateQuests(updated);
             });
          }
        }
      } else {
        setHistory(prev => [...prev, { type: "error", text: typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail) }]);
        setCustomAction(actionText);
      }
    } catch (err) {
      setHistory(prev => [...prev, { type: "error", text: "Server neodpovídá." }]);
      setCustomAction(actionText);
    }
    setLoading(false);
  };

  return (
    <>
      {gameState === "menu" && (
        <div className="h-[100dvh] max-h-[100dvh] w-full max-w-full text-[#2d3748] dark:text-[#e2d9c8] flex flex-col items-center justify-center p-2 sm:p-4 font-serif relative overflow-hidden bg-[#e5dfc5] dark:bg-[#0b0f16] transition-colors duration-500">
          {/* Top right controls: Theme toggle & Audio toggle */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-2">
            {/* Quick Theme Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-[#f9f6e6]/80 hover:bg-[#f9f6e6] dark:bg-[#141c28]/90 dark:hover:bg-[#1a2332] border border-amber-900/20 dark:border-amber-500/30 text-slate-700 dark:text-amber-200 shadow-md backdrop-blur-sm transition flex items-center gap-1.5 text-xs font-cinzel cursor-pointer"
              title={isDark ? "Přepnout na Světlý kodex" : "Přepnout na Černý grimoár"}
            >
              {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-amber-800" />}
              <span className="hidden sm:inline font-bold">{isDark ? "Grimoár" : "Sluneční"}</span>
            </button>

            {/* Audio Toggle */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const nextState = !musicPlaying;
                setMusicPlaying(nextState);
                if (nextState && bgAudioRef.current) {
                  bgAudioRef.current.play().catch(console.error);
                }
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-[#f9f6e6]/80 hover:bg-[#f9f6e6] dark:bg-[#141c28]/90 dark:hover:bg-[#1a2332] border border-amber-900/20 dark:border-amber-500/30 text-slate-700 dark:text-slate-300 shadow-md backdrop-blur-sm transition flex items-center gap-2 text-xs font-cinzel cursor-pointer"
              title={musicPlaying ? "Vypnout hudbu" : "Zapnout hudbu"}
            >
              {musicPlaying ? <Volume2 size={16} className="text-amber-800 dark:text-amber-400" /> : <VolumeX size={16} className="text-slate-400 dark:text-slate-500" />}
              <span className="hidden sm:inline font-bold">{musicPlaying ? "Hudba hraje" : "Hudba vypnuta"}</span>
            </button>
          </div>
        
        {/* Deep ambient background with smooth crossfade between light & dark mode videos */}
        <AmbientBackground />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-5xl w-full z-10 relative flex flex-col items-center mx-auto my-auto shrink-0"
        >
          <div className="mb-2 sm:mb-4 text-center shrink-0 flex flex-col items-center">
            <img 
              src="/images/logo.png" 
              alt="Aelthgard - AI Dungeons & Dragons RPG" 
              className="w-full max-w-[340px] sm:max-w-[460px] md:max-w-[540px] h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] select-none pointer-events-none transition-transform duration-300 hover:scale-102" 
            />
          </div>

          {!isLoggedIn ? (
            <div className="w-full max-w-sm bg-[#f9f6e6]/75 dark:bg-[#121823]/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-2xl">
              {/* Header with Theme Toggle directly on Login Card */}
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-amber-900/10 dark:border-amber-500/20">
                <span className="font-cinzel text-xs font-bold text-amber-950 dark:text-amber-200 tracking-wider">
                  {isRegistering ? "Registrace hrdiny" : "Vstup do říše"}
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-[#182230] border border-amber-900/20 dark:border-amber-500/30 text-xs font-cinzel text-amber-950 dark:text-amber-200 flex items-center gap-1.5 hover:scale-105 transition shadow-2xs cursor-pointer"
                  title={isDark ? "Přepnout na Světlý kodex" : "Přepnout na Černý grimoár"}
                >
                  {isDark ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-amber-800" />}
                  <span>{isDark ? "Grimoár" : "Světlý"}</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full p-3 bg-transparent border-b-2 border-amber-900/20 dark:border-amber-500/30 focus:border-rpg-magic dark:focus:border-amber-400 outline-none text-[#2d3748] dark:text-[#e2d9c8] font-lora text-lg transition placeholder-slate-400 dark:placeholder-slate-500" 
                    placeholder="E-mail" 
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full p-3 bg-transparent border-b-2 border-amber-900/20 dark:border-amber-500/30 focus:border-rpg-magic dark:focus:border-amber-400 outline-none text-[#2d3748] dark:text-[#e2d9c8] font-lora text-lg transition placeholder-slate-400 dark:placeholder-slate-500" 
                    placeholder="Heslo" 
                  />
                </div>
                
                <button 
                  onClick={() => handleAuth(isRegistering)}
                  disabled={loading || !email || !password}
                  className="w-full py-4 bg-white/50 dark:bg-[#1a2434] border border-amber-900/50 dark:border-amber-500/40 text-slate-800 dark:text-amber-200 font-cinzel font-bold text-xl rounded-xl hover:bg-white/70 dark:hover:bg-[#232f44] hover:shadow-[0_0_15px_rgba(197,160,89,0.4)] transition uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                >
                  {loading && <Loader2 size={24} className="animate-spin" />}
                  {isRegistering ? "Vytvořit Účet" : "Vstoupit"}
                </button>
                
                <div className="text-center mt-4">
                  <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-slate-600 dark:text-slate-400 hover:text-[#2d3748] dark:hover:text-amber-300 font-lora transition"
                  >
                    {isRegistering ? "Zpět k přihlášení" : "Zaregistrovat se"}
                  </button>
                </div>
              </div>
            </div>
          ) : savedCharacters.length === 0 ? (
            <div className="text-center w-full max-w-lg bg-[#f9f6e6]/90 dark:bg-[#121823]/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border-2 border-amber-900/20 dark:border-amber-500/30 shadow-2xl">
              <p className="text-slate-700 dark:text-slate-300 font-lora mb-2 text-sm">Přihlášen: <span className="font-bold text-slate-900 dark:text-white">{email}</span></p>
              {loading ? (
                <div className="py-8 flex flex-col items-center gap-3 text-rpg-magic font-cinzel">
                  <Loader2 size={32} className="animate-spin" />
                  <span>Načítám tvé hrdiny...</span>
                </div>
              ) : (
                <>
                  <div className="mb-6 space-y-1.5">
                    <h4 className="text-xl font-cinzel font-bold text-amber-950 dark:text-amber-100">Vítej v Aelthgardu</h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-lora">Dosud nemáš vytvořenou žádnou postavu pro tento účet. Je čas probudit hrdinu a zapsat své jméno do kronik sedmi království.</p>
                  </div>
                  <button 
                    onClick={() => {
                      resetCharacterCreation();
                      setGameState("creation");
                    }}
                    className="w-full py-4 bg-red-800 hover:bg-red-700 active:bg-red-900 border-2 border-red-900/50 text-white font-cinzel font-bold text-xl rounded-2xl shadow-[0_0_25px_rgba(183,75,75,0.5)] hover:shadow-[0_0_30px_rgba(183,75,75,0.8)] transition uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    Zrození Hrdiny
                  </button>
                  <div className="flex justify-between items-center mt-5 pt-3 border-t border-amber-900/10 dark:border-amber-500/20">
                    <button 
                      onClick={() => fetchCharacters(email)}
                      className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-200 font-lora transition flex items-center gap-1.5"
                    >
                      <RotateCcw size={13} /> Obnovit postavy
                    </button>
                    <button 
                      onClick={() => {
                        audioManager.stopTts();
                        localStorage.removeItem("aethelgard_session_email");
                        localStorage.removeItem("aethelgard_active_char");
                        window.location.reload();
                      }}
                      className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-lora transition"
                    >
                      Odhlásit se
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <CharacterCarousel
                characters={savedCharacters}
                onSelectCharacter={(charName) => loadGame(charName)}
                onDeleteCharacter={(e, charName) => deleteCharacter(e, charName)}
                onCreateNew={() => {
                  audioManager.stopTts();
                  resetCharacterCreation();
                  setGameState("creation");
                }}
                getAvatarVideo={getAvatarVideo}
              />

              <button 
                onClick={() => {
                  audioManager.stopTts();
                  localStorage.removeItem("aethelgard_session_email");
                  localStorage.removeItem("aethelgard_active_char");
                  window.location.reload();
                }}
                className="mt-2 px-4 py-1 text-slate-500 dark:text-slate-400 font-lora hover:text-slate-800 dark:hover:text-amber-200 transition text-xs flex items-center gap-1 cursor-pointer shrink-0"
              >
                Odhlásit se
              </button>
            </div>
          )}
        </motion.div>
      </div>
    )}

    {gameState === "creation" && (
      <CharacterCreation onClose={() => setGameState("menu")} startNewGame={startNewGame} loading={loading} backstory={backstory} generateBackstory={generateBackstory} getAvatarVideo={getAvatarVideo} />
    )}

    {gameState === "playing" && (
      <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#1b262c] dark:bg-[#0b0f16] p-1 md:p-6 gap-2 md:gap-4 font-serif flex flex-col items-center relative transition-colors duration-500">
        <DeathModal onClose={() => {}} />

      
      {/* Patch Notes Modal */}
      <PatchNotesModal isOpen={patchNotesOpen} onClose={() => setPatchNotesOpen(false)} />

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* --- AELTHGARD IMMERSIVE GAMEPLAY UI --- */}
      
      {/* Background Layer with Live Ambient Crossfading Videos */}
      <div className="absolute inset-0 z-0">
        <AmbientBackground className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-30 dark:opacity-40" glow={false} />
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 mix-blend-overlay"
          style={{ backgroundImage: `url(${currentLocationImage || 'https://www.transparenttextures.com/patterns/black-scales.png'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f9f6e6]/95 via-[#f9f6e6]/70 to-[#f9f6e6]/30 dark:from-[#0b0f16]/95 dark:via-[#0b0f16]/80 dark:to-[#0b0f16]/50 backdrop-blur-xs transition-colors duration-500" />
      </div>

      <div className="w-full max-w-[1720px] flex flex-col h-full relative z-10 p-1.5 sm:p-3 md:p-4 lg:p-6 pb-0">
        

        {/* Top HUD */}
        <div className="flex flex-col gap-2 md:gap-3 mb-2 md:mb-3 w-full mx-auto relative z-50">
          
          <div className="flex items-center justify-between bg-[#f9f6e6]/60 dark:bg-[#121823]/80 backdrop-blur-md p-2 md:p-4 rounded-2xl border border-amber-900/10 dark:border-amber-500/20 shadow-lg">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-rpg-magic shadow-[0_0_10px_rgba(197,160,89,0.3)] shrink-0 hidden sm:block relative">
                <img src={`https://image.pollinations.ai/prompt/vibrant%20fable%20style%20magical%20fantasy%20portrait%20of%20a%20${encodeURIComponent(race)}%20${encodeURIComponent(dndClass)}%20RPG%20character?width=128&height=128&nologo=true&seed=42`} alt={name} className="w-full h-full object-cover" />
                {getAvatarVideo(race) && (
                  <SeamlessVideo src={getAvatarVideo(race)!} className="absolute inset-0 w-full h-full" />
                )}
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg sm:text-xl font-cinzel text-[#2d3748] dark:text-[#e2d9c8] font-bold drop-shadow-md leading-tight">{name} <span className="text-rpg-magic dark:text-amber-400 text-xs">Lv.{level}</span></h2>
                <div className="text-slate-700 dark:text-slate-400 font-lora text-xs flex items-center gap-1.5 flex-wrap">
                  <span>{race} {dndClass}</span>
                  {currentRegion && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="text-rpg-magic dark:text-amber-400 font-cinzel font-bold flex items-center gap-0.5"><MapPin size={11} /> {currentRegion}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Active TTS Speaking Indicator with Stop Button */}
              {isSpeaking && (
                <button
                  onClick={() => audioManager.stopTts()}
                  className="px-2.5 sm:px-3 py-1 bg-amber-900/90 hover:bg-red-800 text-amber-100 hover:text-white rounded-full text-[11px] sm:text-xs font-cinzel font-bold flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-all animate-pulse cursor-pointer border border-amber-500/40 shrink-0"
                  title="Klikni pro okamžité ztišení vypravěče"
                >
                  <VolumeX size={13} className="text-amber-300" />
                  <span className="hidden sm:inline">Ztišit hlas</span>
                  <span className="sm:hidden">Ztišit</span>
                </button>
              )}
              <div className="flex items-center gap-1 sm:gap-2" title="Životy">
                <Heart size={16} className="text-rpg-blood" />
                <div className="font-cinzel text-[#2d3748] dark:text-[#e2d9c8] text-sm sm:text-base font-bold">
                  <span className={hp <= 20 ? 'text-rpg-blood animate-pulse' : ''}>{hp}</span><span className="text-slate-600 dark:text-slate-400 text-xs">/100</span>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2" title="Zásoby">
                <Drumstick size={16} className={rations < 2 ? "text-rpg-blood animate-pulse" : "text-orange-400"} />
                <div className="font-cinzel text-[#2d3748] dark:text-[#e2d9c8] text-sm sm:text-base font-bold">{rations}</div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2" title="Zlato">
                <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black text-[10px] shadow-[0_0_8px_rgba(234,179,8,0.5)]">Z</div>
                <div className="font-cinzel text-[#2d3748] dark:text-[#e2d9c8] text-sm sm:text-base font-bold">{gold}</div>
              </div>
            </div>

          </div>

          <div className="relative z-50 flex gap-1.5 sm:gap-3 bg-[#f9f6e6]/80 dark:bg-[#121823]/90 backdrop-blur-md border border-amber-900/15 dark:border-amber-500/20 p-1.5 sm:p-2 rounded-2xl shadow-xl items-center justify-center transition-colors duration-300">
            {/* Click outside overlay for dropdowns */}
            {(heroDropdownOpen || menuDropdownOpen) && (
              <div 
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] transition-opacity" 
                onClick={() => { setHeroDropdownOpen(false); setMenuDropdownOpen(false); }} 
              />
            )}

            {/* 1. Hrdina Dropdown (Vlastnosti & Schopnosti) - visible on md+ */}
            <div className="relative z-50 hidden md:block">
              <button 
                onClick={() => { setHeroDropdownOpen(prev => !prev); setMenuDropdownOpen(false); }}
                className={`flex-shrink-0 p-2 sm:p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold relative ${
                  heroDropdownOpen 
                    ? 'bg-amber-200/90 dark:bg-amber-500/25 text-amber-950 dark:text-amber-200 border border-amber-600/40 dark:border-amber-400/50 shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-amber-950 dark:hover:text-amber-100 hover:bg-white/80 dark:hover:bg-white/10'
                }`}
                title="Hrdina - Vlastnosti a schopnosti"
              >
                <Shield size={17} className="text-amber-900 dark:text-amber-400" />
                <span>Hrdina</span>
                {skillPoints > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-600 text-white text-[10px] rounded-full font-bold shadow-xs animate-pulse" title={`${skillPoints} volných dovednostních bodů`}>
                    {skillPoints}
                  </span>
                )}
              </button>

              {heroDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 max-w-[calc(100vw-32px)] bg-[#fdfbf7] dark:bg-[#141c28] border border-amber-900/30 dark:border-amber-500/30 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.35)] p-2 z-[60] flex flex-col gap-1 backdrop-blur-xl">
                  <button 
                    onClick={() => { setStatsOpen(true); setHeroDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-amber-100/70 dark:hover:bg-amber-500/15 rounded-xl transition flex items-center gap-2.5 text-xs sm:text-sm font-cinzel font-bold"
                  >
                    <User size={16} className="text-amber-900 dark:text-amber-400" />
                    <span>Vlastnosti postavy</span>
                  </button>
                  <button 
                    onClick={() => { setSkillsOpen(true); setHeroDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-amber-100/70 dark:hover:bg-amber-500/15 rounded-xl transition flex items-center justify-between gap-2 text-xs sm:text-sm font-cinzel font-bold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={16} className="text-amber-900 dark:text-amber-400" />
                      <span>Kniha schopností</span>
                    </div>
                    {skillPoints > 0 && (
                      <span className="px-1.5 py-0.2 bg-amber-600 text-white text-[10px] rounded-full font-bold shadow-xs animate-pulse">
                        +{skillPoints}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* 2. Batoh (Inventář) */}
            <button 
              onClick={() => { setInventoryOpen(true); setHeroDropdownOpen(false); setMenuDropdownOpen(false); }} 
              className="flex-1 md:flex-none p-2 sm:p-2.5 text-slate-700 dark:text-slate-300 hover:text-amber-950 dark:hover:text-amber-100 hover:bg-white/80 dark:hover:bg-white/10 rounded-xl transition flex items-center justify-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold"
              title="Inventář a výbava"
            >
              <Package size={17} className="text-amber-900 dark:text-amber-400" /> <span>Batoh</span>
            </button>
            
            {/* 3. Úkoly */}
            <button 
              onClick={() => { setQuestsOpen(true); setUnreadQuests(false); setHeroDropdownOpen(false); setMenuDropdownOpen(false); }} 
              className={`flex-1 md:flex-none p-2 sm:p-2.5 rounded-xl transition flex items-center justify-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold relative ${
                unreadQuests 
                  ? 'bg-amber-200/90 dark:bg-amber-500/25 text-amber-950 dark:text-amber-200 border border-amber-600/50 dark:border-amber-400/50 shadow-[0_0_12px_rgba(212,175,55,0.4)]' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-amber-950 dark:hover:text-amber-100 hover:bg-white/80 dark:hover:bg-white/10'
              }`}
              title="Kniha úkolů"
            >
              <ScrollText size={17} className="text-amber-900 dark:text-amber-400" /> 
              <span>Úkoly</span>
              {quests.filter(q => q.stav === 'aktivni' || (!q.stav?.includes('spln') && !q.stav?.includes('selh'))).length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-800 text-white text-[10px] rounded-full font-bold shadow-xs">
                  {quests.filter(q => q.stav === 'aktivni' || (!q.stav?.includes('spln') && !q.stav?.includes('selh'))).length}
                </span>
              )}
              {unreadQuests && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
              )}
            </button>

            {/* 4. Mapa */}
            <button 
              onClick={() => { setMapOpen(true); setHeroDropdownOpen(false); setMenuDropdownOpen(false); }} 
              className="flex-1 md:flex-none p-2 sm:p-2.5 text-amber-900 dark:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-amber-500/15 rounded-xl transition flex items-center justify-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold"
              title="Mapa světa"
            >
              <Map size={17} /> <span>Mapa</span>
            </button>

            {/* 4b. Tábor - visible on md+ */}
            <button 
              onClick={() => { setCampOpen(true); setHeroDropdownOpen(false); setMenuDropdownOpen(false); }} 
              className="hidden md:flex flex-shrink-0 p-2 sm:p-2.5 text-amber-900 dark:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-amber-500/15 rounded-xl transition items-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold"
              title="Táboření a odpočinek"
            >
              <Flame size={17} className="text-amber-600 dark:text-amber-400" /> <span>Tábor</span>
            </button>

            {/* 4c. Tržnice & Služby - visible on md+ */}
            <button 
              onClick={() => { setTownServicesOpen(true); setHeroDropdownOpen(false); setMenuDropdownOpen(false); }} 
              className="hidden md:flex flex-shrink-0 p-2 sm:p-2.5 text-amber-950 dark:text-amber-200 bg-amber-200/90 dark:bg-amber-600/30 hover:bg-amber-300/90 dark:hover:bg-amber-600/50 border border-amber-600/40 dark:border-amber-400/40 rounded-xl transition items-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold shadow-2xs"
              title="Městské služby, kovář a tržnice"
            >
              <ShoppingBag size={17} className="text-amber-800 dark:text-amber-300" /> <span>Tržnice</span>
            </button>

            {/* 5. Menu Dropdown (Deník, Postavy, Nastavení, Návrat) */}
            <div className="relative z-50">
              <button 
                onClick={() => { setMenuDropdownOpen(prev => !prev); setHeroDropdownOpen(false); }}
                className={`flex-shrink-0 p-2 sm:p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold ${
                  menuDropdownOpen 
                    ? 'bg-amber-200/90 dark:bg-amber-500/25 text-amber-950 dark:text-amber-200 border border-amber-600/40 dark:border-amber-400/50 shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-amber-950 dark:hover:text-amber-100 hover:bg-white/80 dark:hover:bg-white/10'
                }`}
                title="Další volby a systémové menu"
              >
                <Menu size={17} className="text-amber-900 dark:text-amber-400" />
                <span className="hidden sm:inline">Menu</span>
              </button>

              {menuDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 max-w-[calc(100vw-32px)] bg-[#fdfbf7] dark:bg-[#141c28] border border-amber-900/30 dark:border-amber-500/30 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.35)] p-2.5 z-[60] flex flex-col gap-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Mobile Hero Actions */}
                  <div className="md:hidden flex flex-col gap-1 border-b border-amber-900/10 dark:border-amber-500/20 pb-1.5 mb-1">
                    <button 
                      onClick={() => { setStatsOpen(true); setMenuDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-amber-100/70 dark:hover:bg-amber-500/15 rounded-xl transition flex items-center gap-2.5 text-xs sm:text-sm font-cinzel font-bold"
                    >
                      <User size={16} className="text-amber-900 dark:text-amber-400" />
                      <span>Vlastnosti hrdiny</span>
                    </button>
                    <button 
                      onClick={() => { setSkillsOpen(true); setMenuDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-amber-100/70 dark:hover:bg-amber-500/15 rounded-xl transition flex items-center justify-between gap-2.5 text-xs sm:text-sm font-cinzel font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles size={16} className="text-amber-900 dark:text-amber-400" />
                        <span>Kniha schopností</span>
                      </div>
                      {skillPoints > 0 && (
                        <span className="px-1.5 py-0.2 bg-amber-600 text-white text-[10px] rounded-full font-bold shadow-xs">
                          +{skillPoints}
                        </span>
                      )}
                    </button>
                  </div>

                  <button 
                    onClick={() => { setTownServicesOpen(true); setMenuDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-amber-950 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-600/25 hover:bg-amber-200/80 dark:hover:bg-amber-600/40 rounded-xl transition flex items-center gap-2.5 text-xs sm:text-sm font-cinzel font-bold border border-amber-900/15 dark:border-amber-500/25"
                  >
                    <ShoppingBag size={16} className="text-amber-800 dark:text-amber-300" />
                    <span>Tržnice & Služby</span>
                  </button>
                  <button 
                    onClick={() => { setCampOpen(true); setMenuDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-amber-100/70 dark:hover:bg-amber-500/15 rounded-xl transition flex items-center gap-2.5 text-xs sm:text-sm font-cinzel font-bold"
                  >
                    <Flame size={16} className="text-amber-600 dark:text-amber-400" />
                    <span>Táboření a odpočinek</span>
                  </button>
                  <button 
                    onClick={() => { setJournalOpen(true); setMenuDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-amber-100/70 dark:hover:bg-amber-500/15 rounded-xl transition flex items-center gap-2.5 text-xs sm:text-sm font-cinzel font-bold"
                  >
                    <BookOpen size={16} className="text-amber-900 dark:text-amber-400" />
                    <span>Deník a kronika</span>
                  </button>
                  <button 
                    onClick={() => { setNpcsOpen(true); setMenuDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-amber-100/70 dark:hover:bg-amber-500/15 rounded-xl transition flex items-center gap-2.5 text-xs sm:text-sm font-cinzel font-bold"
                  >
                    <Users size={16} className="text-amber-900 dark:text-amber-400" />
                    <span>Známé postavy</span>
                  </button>
                  <button 
                    onClick={() => { setSettingsOpen(true); setMenuDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-amber-100/70 dark:hover:bg-amber-500/15 rounded-xl transition flex items-center gap-2.5 text-xs sm:text-sm font-cinzel font-bold"
                  >
                    <Settings2 size={16} className="text-amber-900 dark:text-amber-400" />
                    <span>Nastavení</span>
                  </button>
                  <div className="h-[1px] bg-amber-900/10 dark:bg-amber-500/20 my-1" />
                  <button 
                    onClick={() => {
                      audioManager.stopTts();
                      localStorage.removeItem("aethelgard_active_char");
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      setMenuDropdownOpen(false);
                      setGameState("menu");
                      fetchCharacters(email);
                    }}
                    className="w-full text-left px-3 py-2 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition flex items-center gap-2.5 text-xs sm:text-sm font-cinzel font-bold"
                  >
                    <Users size={16} className="text-red-700 dark:text-red-400" />
                    <span>Výběr hrdiny</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl transition flex items-center justify-center text-xs font-cinzel font-bold text-slate-700 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 hover:bg-white/80 dark:hover:bg-white/10 border border-transparent dark:border-amber-500/20 cursor-pointer"
              title={isDark ? "Přepnout na Světlý kodex (Sluneční)" : "Přepnout na Tmavý režim (Černý grimoár)"}
            >
              {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-amber-900" />}
            </button>
          </div>
          
        </div>
        {inCombat ? (
          <div className="flex-1 min-h-0 overflow-hidden relative mb-3 w-full max-w-5xl mx-auto z-10">
            <CombatArena onVictory={handleCombatResolution} />
          </div>
        ) : (
          <div className="flex-1 min-h-0 w-full flex gap-4 lg:gap-6 overflow-hidden mb-2">
            
            {/* Left Column: Primary Narrative & Action Stream */}
            <div className="flex-1 min-w-0 flex flex-col h-full min-h-0 overflow-hidden">
              
              {/* HUD Mini-Tracker for Active/Pinned Quest */}
              {activeTrackedQuest && (
                <div 
                  onClick={() => { setQuestsOpen(true); setUnreadQuests(false); }}
                  className="mb-2 px-3.5 sm:px-4 py-2 rounded-xl bg-[#fdfbf7]/90 hover:bg-[#fdfbf7] dark:bg-[#141c28]/90 dark:hover:bg-[#1a2332] border border-amber-900/20 dark:border-amber-500/25 shadow-xs backdrop-blur-md transition cursor-pointer flex items-center justify-between gap-3 group shrink-0"
                  title="Klikni pro otevření Knihy úkolů"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 shrink-0 border border-amber-900/10 dark:border-amber-500/20">
                      <ScrollText size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-cinzel font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-100 truncate">
                          {activeTrackedQuest.nazev}
                        </span>
                        <span className={`text-[9px] font-cinzel font-bold px-1.5 py-0.2 rounded-full shrink-0 border ${
                          activeTrackedQuest.kategorie === 'hlavni'
                            ? 'bg-amber-200 dark:bg-amber-500/30 text-amber-950 dark:text-amber-200 border-amber-400 dark:border-amber-400/40'
                            : 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-900/15 dark:border-amber-500/20'
                        }`}>
                          {activeTrackedQuest.kategorie === 'hlavni' ? '🌟 HLAVNÍ' : '📜 ÚKOL'}
                        </span>
                      </div>
                      <div className="font-lora text-[11px] text-slate-700 dark:text-slate-300 truncate flex items-center gap-1.5 mt-0.5">
                        <Target size={11} className="text-amber-700 dark:text-amber-400 shrink-0" />
                        <span className="truncate">
                          {(() => {
                            const kroky = activeTrackedQuest.kroky || [];
                            const curr = kroky.find((k: any) => !k?.splneno);
                            return curr?.text || activeTrackedQuest.popis || 'Probíhá plnění...';
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-cinzel font-bold text-amber-800/70 dark:text-amber-400/80 group-hover:text-amber-900 dark:group-hover:text-amber-200 transition shrink-0 hidden sm:inline">
                    Otevřít deník →
                  </span>
                </div>
              )}

              {/* Story Log (Middle) */}
              <div className="flex-1 min-h-0 overflow-hidden relative mb-3">
                <div className="absolute inset-0 bg-[#f9f6e6]/70 dark:bg-[#0f141f]/85 backdrop-blur-lg border border-amber-900/10 dark:border-amber-500/20 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5 sm:gap-6" >
                
                {history.map((msg, i) => (
                  <div key={i} className={`flex ${msg.type === "player" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] md:max-w-[75%] p-5 rounded-2xl ${
                      msg.type === "player" 
                        ? "bg-white/50 dark:bg-[#1a2332]/70 border border-amber-900/10 dark:border-amber-500/15 text-slate-800 dark:text-[#e2d9c8] font-lora" 
                        : msg.type === "system" || msg.type === "error"
                          ? "bg-[#f4ecd8] dark:bg-[#161d2a] border border-amber-900/5 dark:border-amber-500/10 text-slate-700 dark:text-slate-300 font-cinzel text-sm italic"
                          : "bg-[#f9f6e6]/80 dark:bg-[#141c28]/90 border border-rpg-magic/30 dark:border-amber-500/25 text-[#2d3748] dark:text-[#e2d9c8] font-lora shadow-[0_0_15px_rgba(197,160,89,0.1)]"
                    }`}>
                      {msg.type === "player" && (
                        <div className="leading-relaxed text-lg">{msg.text}</div>
                      )}
                      {msg.type === "system" && <FormattedSystemLog text={msg.text} />}
                      {msg.type === "error" && <div className="text-red-700 font-bold">Chyba: {msg.text}</div>}
                      {msg.type === "dm" && (
                        <div className="flex flex-col gap-4">
                          {msg.vypravec && (
                            <div className="leading-relaxed text-lg">
                              <button onClick={() => playAudio(msg.vypravec, 'narrator')} className="float-right ml-4 text-slate-600 dark:text-slate-400 hover:text-rpg-magic dark:hover:text-amber-300 transition">
                                <Volume2 size={18} />
                              </button>
                              <TypewriterText text={msg.vypravec} animate={i === history.length - 1} />
                            </div>
                          )}
                          {msg.popis_okoli && (
                            <div className="text-slate-700 dark:text-slate-300 italic font-lora text-sm border-l-2 border-rpg-magic/50 dark:border-amber-400/60 pl-3">
                              {msg.popis_okoli}
                            </div>
                          )}
                          {msg.npc_dialogy && msg.npc_dialogy.length > 0 && (
                            <div className="flex flex-col gap-2 mt-2">
                              {msg.npc_dialogy.map((npc: any, nIdx: number) => (
                                <div key={nIdx} className="bg-[#f4ecd8]/90 dark:bg-[#1b2433]/90 p-3.5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-2xs">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-rpg-magic dark:text-amber-400 font-cinzel">{npc.jmeno}</span>
                                    <button onClick={() => playAudio((npc.text || npc.replika), isFemale(npc.pohlavi) ? 'npc_zena' : 'npc_muz')} className="text-slate-600 dark:text-slate-400 hover:text-[#2d3748] dark:hover:text-amber-200"><Volume2 size={16} /></button>
                                  </div>
                                    <div className="text-slate-900 dark:text-[#f1ede4]">"{npc.text || npc.replika}"</div>
                                </div>
                              ))}
                            </div>
                          )}
                          {msg.system_log && (
                            <div className="text-xs font-mono mt-2 opacity-90 border-t border-amber-900/10 dark:border-amber-500/15 pt-2">
                              <FormattedSystemLog text={msg.system_log} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start animate-fade-in-up my-2">
                    <div className="bg-[#f5eedc] dark:bg-[#18202d] border-2 border-amber-600/60 dark:border-amber-500/50 p-4 sm:p-5 rounded-2xl flex items-center gap-3.5 shadow-lg shadow-amber-900/10 dark:shadow-black/40">
                      <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-amber-600 text-white shadow-md shrink-0">
                        <Sparkles className="animate-spin" size={18} />
                        <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-50" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-amber-950 dark:text-amber-100 font-cinzel font-bold text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                          Vypravěč přemýšlí a spřádá osud...
                        </span>
                        <span className="text-amber-800/80 dark:text-amber-300/80 font-lora text-xs italic">
                          Tvá volba právě mění chod příběhu
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {/* Embedded choices directly inside story log */}
                {!loading && !inCombat && suggestedActions.length > 0 && (
                  <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-amber-900/15 dark:border-amber-500/20">
                    <div className="text-xs font-cinzel text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
                      Možné volby:
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {suggestedActions.map((act, i) => (
                        <button
                          key={`chat-act-${i}`}
                          onClick={() => sendAction(act)}
                          className="w-full text-left bg-[#fcfaf2] hover:bg-amber-100/90 dark:bg-[#171f2c] dark:hover:bg-[#1f2b3e] border-2 border-amber-900/15 hover:border-amber-600 dark:border-amber-500/20 dark:hover:border-amber-400 hover:shadow-[0_4px_16px_rgba(180,83,9,0.25)] px-4 sm:px-5 py-3.5 rounded-xl text-slate-800 hover:text-amber-950 dark:text-slate-200 dark:hover:text-amber-200 transition-all font-lora text-sm sm:text-base flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-amber-900/10 dark:bg-amber-500/15 group-hover:bg-amber-700 dark:group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center text-xs font-cinzel font-bold text-amber-900 dark:text-amber-300 transition-colors shrink-0">
                              {i + 1}
                            </span>
                            <span className="font-medium group-hover:font-bold transition-all">{act}</span>
                          </div>
                          <span className="opacity-0 group-hover:opacity-100 transition-all bg-amber-700 text-white px-3 py-1 rounded-xl font-cinzel text-xs font-bold shrink-0 ml-3 shadow-sm flex items-center gap-1 group-hover:translate-x-1">
                            Zvolit &rarr;
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Bottom Actions & Input */}
            <div className="shrink-0 flex flex-col gap-2.5 pb-2 w-full px-1 sm:px-0">
              
              {/* Action Buttons & Dock */}
              <div className="flex flex-wrap justify-between items-end gap-4">
                
                {/* Contextual Actions */}
                <div className="flex flex-nowrap gap-2 flex-1 overflow-x-auto snap-x custom-scrollbar hide-scrollbar pb-2">
                    <>
                      {pointsOfInterest.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 py-1">
                          <span className="text-xs font-cinzel font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1 uppercase tracking-wider mr-1">
                            <MapPin size={14} className="text-amber-700 dark:text-amber-400" /> Lokace v okolí:
                          </span>
                          {pointsOfInterest.map((poi, i) => (
                            <button 
                              key={`poi-${i}`} 
                              onClick={() => sendAction(`Jdu prozkoumat: ${poi.nazev}`)} 
                              className="bg-[#f2ece1] hover:bg-amber-100 dark:bg-[#161d2a] dark:hover:bg-[#1f2b3e] border border-amber-900/30 dark:border-amber-500/25 hover:border-amber-700 dark:hover:border-amber-400 text-slate-900 hover:text-amber-950 dark:text-slate-200 dark:hover:text-amber-200 px-3.5 py-2 rounded-xl text-xs font-cinzel font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <MapPin size={14} className="text-amber-700 dark:text-amber-400" />
                              <span>{poi.nazev}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                </div>

              </div>

              {/* Magical Input Box */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-rpg-magic/20 to-transparent rounded-2xl blur-md pointer-events-none" />
                <div className="relative flex flex-row items-center gap-2 sm:gap-3 bg-white/90 dark:bg-[#121823]/95 backdrop-blur-xl p-2 sm:p-3 rounded-2xl border border-rpg-magic/30 dark:border-amber-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                  <button
                    onClick={() => setIsOOC(!isOOC)}
                    className={`p-2.5 sm:p-3.5 transition-all rounded-xl flex items-center justify-center shrink-0 cursor-pointer ${isOOC ? 'bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'text-slate-600 dark:text-slate-400 hover:text-rpg-magic dark:hover:text-amber-300 bg-white/50 dark:bg-white/5 border border-transparent'}`}
                    title="OOC (Myšlenka)"
                  >
                    <Brain size={22} className={isOOC ? "animate-pulse text-indigo-600" : ""} />
                  </button>
                  <input 
                    type="text" 
                    value={customAction}
                    onChange={(e) => setCustomAction(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendAction(customAction)}
                    placeholder={isOOC ? "Přemýšlím nad..." : "Co uděláš dál?"} 
                    className={`flex-1 min-w-0 font-lora text-sm sm:text-lg bg-transparent px-2 sm:px-3 py-2 outline-none transition-colors ${isOOC ? 'text-indigo-900 dark:text-indigo-200 placeholder-indigo-400' : 'text-[#2d3748] dark:text-[#e2d9c8] placeholder-gray-500 dark:placeholder-slate-500'}`}
                    disabled={loading}
                  />
                  <button 
                    onClick={() => sendAction(customAction)}
                    className="bg-red-800 hover:bg-red-700 active:bg-red-900 text-white px-3.5 sm:px-8 py-2.5 sm:py-3 shrink-0 rounded-xl font-cinzel font-bold text-sm sm:text-base tracking-wider sm:tracking-widest transition-all disabled:opacity-50 disabled:bg-red-900/40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 shadow-[0_0_15px_rgba(183,75,75,0.4)] cursor-pointer"
                    disabled={loading || !customAction.trim()}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin text-white" />
                        <span className="hidden sm:inline text-xs sm:text-sm">Spřádám...</span>
                      </>
                    ) : (
                      "Vydat se"
                    )}
                  </button>
                </div>
              </div>
            </div>
            </div>

            {/* Right Column: Desktop Companion Panel (lg and xl screens) */}
            <DesktopSidePanel 
              onOpenInventory={() => setInventoryOpen(true)}
              onOpenMap={() => setMapOpen(true)}
              onOpenQuests={() => { setQuestsOpen(true); setUnreadQuests(false); }}
              onOpenTownServices={() => setTownServicesOpen(true)}
              onOpenCamp={() => setCampOpen(true)}
              onOpenStats={() => setStatsOpen(true)}
              onOpenSkills={() => setSkillsOpen(true)}
            />

          </div>
        )}
      </div>

      {/* Stats Modal */}
      <StatsModal isOpen={statsOpen} onClose={() => setStatsOpen(false)} />

      {/* Journal Modal */}
      <JournalModal 
        isOpen={journalOpen} 
        onClose={() => setJournalOpen(false)} 
        onSwitchToQuests={() => {
          setQuestsOpen(true);
          setUnreadQuests(false);
        }}
      />

      {/* Skills Modal */}
      <SkillsModal isOpen={skillsOpen} onClose={() => setSkillsOpen(false)} setCustomAction={setCustomAction} />

      {/* Quests Modal */}
      <QuestsModal 
        isOpen={questsOpen} 
        onClose={() => setQuestsOpen(false)} 
        onSwitchToJournal={() => setJournalOpen(true)}
      />

      {/* Map Modal */}
      <MapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} setSelectedItem={setSelectedItem} onTravel={handleTravel} />

      {/* NPCs Modal */}
      <NpcsModal isOpen={npcsOpen} onClose={() => setNpcsOpen(false)} setMapOpen={setMapOpen} />

      {/* Camp Modal */}
      <CampModal isOpen={campOpen} onClose={() => setCampOpen(false)} />

      {/* Town Services Modal */}
      <TownServicesModal isOpen={townServicesOpen} onClose={() => setTownServicesOpen(false)} />

      {/* Inventory Modal */}
      <InventoryPanel 
        isOpen={inventoryOpen} 
        onClose={() => setInventoryOpen(false)} 
        selectedItem={selectedItem} 
        setSelectedItem={setSelectedItem} 
      />

      {/* Atmospheric Quest Notification Banner */}
      {/* Atmospheric Consequence & World Mutation Toast */}
      {consequenceToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#1b262c]/95 border-2 border-amber-500 text-amber-100 px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.5)] backdrop-blur-md flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-bold shrink-0">
              ⚖️
            </div>
            <div>
              <div className="font-cinzel font-bold text-xs uppercase tracking-wider text-amber-300">
                Svět reaguje na tvé činy
              </div>
              <div className="font-lora text-xs sm:text-sm text-slate-100 font-medium">
                {consequenceToast.text}
              </div>
            </div>
          </div>
        </div>
      )}

      {questBanner && (
        <div 
          onClick={() => {
            setQuestsOpen(true);
            setUnreadQuests(false);
            setQuestBanner(null);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs cursor-pointer animate-in fade-in duration-300"
        >
          <div className="flex flex-col items-center bg-[#f9f6e6]/95 border-2 border-amber-600/50 px-8 sm:px-12 py-6 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.4)] backdrop-blur-xl max-w-lg text-center hover:scale-105 transition transform">
            <div className="text-amber-800 text-xs sm:text-sm font-cinzel font-bold tracking-[0.3em] uppercase mb-1.5 flex items-center gap-2">
              <Sparkles size={16} /> {questBanner.title} <Sparkles size={16} />
            </div>
            {questBanner.subtitle && (
              <div className="text-amber-950 text-xl sm:text-2xl font-cinzel font-bold mb-2">
                {questBanner.subtitle}
              </div>
            )}
            <span className="text-[11px] font-lora text-amber-900 font-bold bg-amber-100 px-3 py-1 rounded-full border border-amber-900/15">
              Klikni pro zobrazení v Knize úkolů
            </span>
          </div>
        </div>
      )}

        </div>
      )}

      {/* Persistent Global HTML5 Audio Player */}
      <audio 
        id="bg-audio" 
        ref={bgAudioRef} 
        src={currentTrack} 
        loop 
        autoPlay 
        onError={() => { 
          if (currentTrack !== "/music/theme.mp3") setCurrentTrack("/music/theme.mp3"); 
        }} 
      />
    </>
  );
}
