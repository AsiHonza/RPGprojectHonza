"use client";

import HexMap from "../components/map/HexMap";
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from "react";
import { useGameStore, isSameQuest, normalizeQuestTitle, deduplicateQuests, autoEquipItems } from '../store/gameStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

import { ItemIcon } from '../components/ui/ItemIcon';
import { InventoryPanel } from '../features/character/InventoryPanel';
import { DeathModal } from '../features/character/DeathModal';
import ReactPlayer from 'react-player';
import { Send, Heart, Flame, Package, Sword, Shield, FlaskConical, Gem, Shirt, ScrollText, X, Volume2, VolumeX, User, Users, Settings2, Map, Sparkles, Skull, BookOpen, MapPin, Drumstick, Mail, Loader2, Trash2 , Brain , Menu, RotateCcw } from "lucide-react";
import { CharacterCreation } from '../features/character/CharacterCreation';
import { MapModal } from '../features/map/MapModal';
import { QuestsModal } from '../features/character/QuestsModal';
import { JournalModal } from '../features/character/JournalModal';
import { NpcsModal } from '../features/character/NpcsModal';
import { SkillsModal } from '../features/character/SkillsModal';
import { StatsModal } from '../features/character/StatsModal';
import { SettingsModal } from '../features/ui/SettingsModal';
import { PatchNotesModal } from '../features/ui/PatchNotesModal';
import { PlayerHeader } from '../features/ui/PlayerHeader';
import { CombatArena } from '../features/combat/CombatArena';
import { PATCH_NOTES } from '../data/patchNotes';
import { SeamlessVideo } from '../components/ui/SeamlessVideo';
import { CharacterCarousel } from '../components/character/CharacterCarousel';

const getAvatarVideo = (r?: string) => {
  if (!r) return null;
  const lower = r.toLowerCase();
  const normalized = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (normalized.includes('clovek') || lower.includes('human')) return '/video/avatars/clovek.mp4';
  if (normalized.includes('trpasl') || lower.includes('dwarf')) return '/video/avatars/trpaslik.mp4';
  if (normalized.includes('drak') || lower.includes('dragon')) return '/video/avatars/drakorozeny.mp4';
  if (lower.includes('tiefling')) return '/video/avatars/tiefling.mp4';
  if (normalized.includes('ork') || lower.includes('orc')) return '/video/avatars/pulork.mp4';
  // Other races (Elf, Půlčík, Gnóm) don't have animated portraits yet - fall back to static image
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
        .replace(/(Kritický úspěch!|Kritický úspěch|Kritický úspěch\.)/gi, '<span class="text-green-700 font-bold uppercase tracking-wider">$1</span>')
        .replace(/(Kritické selhání!|Kritické selhání|Kritický neúspěch)/gi, '<span class="text-red-500 font-bold uppercase tracking-wider">$1</span>')
        .replace(/(?<!\p{L})(Úspěch\.|Úspěch!|Úspěch:?)/giu, '<span class="text-green-700 font-bold">$1</span>')
        .replace(/(?<!\p{L})(Selhání\.|Selhání!|Selhání:?|Neúspěch\.|Neúspěch!|Neúspěch:?)/giu, '<span class="text-red-700 font-bold">$1</span>')
        .replace(/(Hráč ztrácí \d+ HP|ztrácí \d+ HP|způsobuje \d+ bodů poškození|Ztrácí \d+ HP)/gi, '<span class="text-red-700 font-bold">$1</span>')
        .replace(/(d\d+\(\d+\))/g, '<span class="text-amber-700 font-bold">$1</span>')
        .replace(/(\d+ vs DC \d+)/g, '<span class="text-amber-700 font-bold">$1</span>')
        .replace(/(vs AC \d+)/g, '<span class="text-amber-700 font-bold">$1</span>')
        .replace(/(Útok vlka|Útok nepřítele|Útok skřeta|Útok orka)/gi, '<span class="text-red-700 font-bold">$1</span>')
        .replace(/(Útok hráče.*?:)/gi, '<span class="text-green-700 font-bold">$1</span>')
        .replace(/(Zásah!)/g, '<span class="font-bold border-b border-red-400 text-red-700">$1</span>')
        .replace(/(Hod na .*?:)/gi, '<span class="text-rpg-magic font-bold">$1</span>')
        .replace(/(Aktivní akce:)/gi, '<span class="text-blue-300 font-bold">$1</span>')
        .replace(/(Výsledek:)/gi, '<span class="text-slate-900 font-bold">$1</span>');
      
      return (
        <div key={idx} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: html }} />
      );
    });
    return <div className="font-mono text-sm text-slate-800 leading-relaxed bg-[#f9f6e6]/60 p-4 rounded-xl border border-amber-900/10 shadow-inner mt-2">{lines}</div>;
  };



export default function Home() {
  const { bgVolume, setBgVolume, currentTrack, setCurrentTrack, ttsVolume, setTtsVolume, ttsProvider, setTtsProvider, musicPlaying, setMusicPlaying, unreadQuests, setUnreadQuests, gameState, setGameState, loading, setLoading, name, setName, dndClass, setDndClass, race, setRace, stats, setStats, keywords, setKeywords, gameMode, setGameMode, backstory, setBackstory, hp, setHp, maxHp, setMaxHp, level, setLevel, xp, setXp, gold, setGold, rations, setRations, skillPoints, setSkillPoints, inventory, setInventory, equipped, setEquipped, worldData, setWorldData, journal, setJournal, quests, setQuests, npcs, setNpcs, currentRegion, setCurrentRegion, locationType, setLocationType, currentSpellSlots, setCurrentSpellSlots, maxSpellSlots, setMaxSpellSlots, skills, setSkills, availableSkills, setAvailableSkills, inCombat, setInCombat, enemies, setEnemies , playerLocation, setPlayerLocation, setDay, history, setHistory, suggestedActions, setSuggestedActions, pointsOfInterest, setPointsOfInterest, currentLocationImage, setCurrentLocationImage, currentLocationDesc, setCurrentLocationDesc, currentImage, setCurrentImage, combatLog, setCombatLog } = useGameStore();


  const [actionsOpen, setActionsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Character Creation Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Game Play State
  const [savedCharacters, setSavedCharacters] = useState<any[]>([]);
      const [customAction, setCustomAction] = useState("");
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [isOOC, setIsOOC] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [patchNotesOpen, setPatchNotesOpen] = useState(false);
  
  // Nové stavy pro boj a RPG systém
  
  // Quests
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [questsOpen, setQuestsOpen] = useState(false);
      const [travelMode, setTravelMode] = useState(false);
  const [travelDaysLeft, setTravelDaysLeft] = useState(0);
  const [travelDestination, setTravelDestination] = useState("");
  const [npcsOpen, setNpcsOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);


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
      case "Barbarian": setStats(assign("str", "con", "dex")); break;
      case "Fighter": setStats(assign("str", "con", "dex")); break;
      case "Rogue": setStats(assign("dex", "intel", "cha")); break;
      case "Wizard": setStats(assign("intel", "con", "dex")); break;
      case "Cleric": setStats(assign("wis", "con", "str")); break;
      case "Bard": setStats(assign("cha", "dex", "con")); break;
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
            locationType, currentRegion, pointsOfInterest, stats, rations, currentImage, currentImageError, currentLocationDesc, travel_mode: travelMode, travel_days_left: travelDaysLeft, travel_destination: travelDestination, zname_postavy: npcs, world_data: worldData, playerLocation: playerLocation
          }
        }),
      }).catch(err => console.error("Autosave failed", err));
    }, 2000);
    return () => clearTimeout(timer);
  }, [hp, maxHp, inventory, equipped, level, xp, skillPoints, skills, inCombat, enemies, quests, locationType, currentRegion, pointsOfInterest, gameState, stats, gold, currentSpellSlots, maxSpellSlots, rations, currentImage, currentImageError, travelMode, travelDaysLeft, travelDestination, npcs, worldData, playerLocation]);

  const playAudio = (text: string, voiceType: "narrator" | "npc_muz" | "npc_zena" = "narrator"): Promise<void> => {
    return new Promise((resolve) => {
      let voice = "cs-CZ-AntoninNeural";
      if (voiceType === "npc_zena") voice = "cs-CZ-VlastaNeural";
      if (voiceType === "npc_muz") voice = "cs-CZ-AntoninNeural";

      const url = `${API_URL}/tts?text=${encodeURIComponent(text)}&voice_type=${voiceType}&provider=${ttsProvider}&voice=${voice}`;
        fetch(url)
          .then(res => res.blob())
          .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const audio = new Audio(blobUrl);
            audio.volume = ttsVolume;
            audio.onended = () => { URL.revokeObjectURL(blobUrl); resolve(); };
            audio.onerror = () => { URL.revokeObjectURL(blobUrl); resolve(); };
            audio.play().catch(e => {
              console.error("Chyba přehrávání:", e);
              URL.revokeObjectURL(blobUrl);
              resolve();
            });
          })
          .catch(e => {
            console.error("Network chyba TTS:", e);
            resolve();
          });
    });
  };

  const playAudioSequentially = async (texts: {text: string, type: "narrator" | "npc_muz" | "npc_zena"}[]) => {
    for (const item of texts) {
      if (item.text) {
        await playAudio(item.text, item.type);
      }
    }
  };

  const generateBackstory = async () => {
    if (!name || !keywords) return alert("Zadejte jméno a klíčová slova!");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate-backstory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: "DUMMY", name, race, dnd_class: dndClass, keywords }),
      });
      if (res.ok) {
        setBackstory(await res.json());
      } else {
        alert("Chyba při generování.");
      }
    } catch (err) {
      alert("Chyba připojení.");
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

  const loadGame = async (characterName: string, overrideEmail: string = email) => {
    if (!overrideEmail || !characterName) return alert("Přihlaste se a vyberte postavu!");
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
        
        let lastSuggestedActions: string[] = [];
        let lastImage = null;
          let lastAudioQueue: {text: string, type: "narrator"|"npc_muz"|"npc_zena"}[] = [];
        
        const loadedHistory = data.character.history.map((msg: any) => {
          if (msg.role === "user") {
            return { type: "player", text: msg.text };
          }
          if (msg.role === "model") {
            try {
                let t = msg.text.trim();
                if (t.startsWith('```json')) t = t.substring(7);
                if (t.endsWith('```')) t = t.substring(0, t.length - 3);
                t = t.trim();
                const dm_data = JSON.parse(t);
              if (dm_data.nabizene_akce) lastSuggestedActions = dm_data.nabizene_akce;
              if (dm_data.image_prompt) lastImage = dm_data.image_prompt;
                lastAudioQueue = [];
                if (dm_data.vypravec) lastAudioQueue.push({text: dm_data.vypravec, type: "narrator"});
                if (dm_data.npc_dialogy) dm_data.npc_dialogy.forEach((n: any) => { if (n.text) lastAudioQueue.push({text: n.text, type: n.pohlavi === "muz" ? "npc_muz" : "npc_zena"}) });
              
              return {
                type: "dm",
                popis_okoli: dm_data.popis_okoli,
                image_prompt: dm_data.image_prompt,
                vypravec: dm_data.vypravec,
                system_log: dm_data.system_log,
                npc_dialogy: dm_data.npc_dialogy,
                v_boji: dm_data.v_boji,
                nepratele: dm_data.nepratele,
                typ_lokace: dm_data.typ_lokace,
                aktualni_region: dm_data.aktualni_region,
                vyznamna_mista: dm_data.vyznamna_mista
              };
            } catch (e) {
                console.error("JSON parse failed on:", msg.text, "\nError:", e);
              return { type: "error", text: "Chybný formát zprávy z historie." };
            }
          }
          return null;
        }).filter(Boolean);
        
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
        alert(data.detail || "Chyba při načítání pozice.");
      }
    } catch (err) {
      console.error(err); alert("Chyba připojení k serveru.");
    }
    setLoading(false);
  };

  const startNewGame = async () => {
    if (!name) return alert("Zadejte jméno!");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/create-character`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dnd_class: dndClass, race, stats, email: email, api_key: "DUMMY", game_mode: gameMode }),
      });
      const data = await res.json();
      
      if (res.ok) {
        // Load the character to fetch full state including generated world_data
        await loadGame(name);
        
        // Ensure UI updates properly to playing state
        setGameState("playing");
        localStorage.setItem("aethelgard_active_char", name);
      } else {
        alert(data.detail || "Chyba při tvorbě.");
      }
    } catch (e) {
      alert("Nelze se připojit k serveru.");
    }
    setLoading(false);
  };


  const handleTravel = async (q: number, r: number, targetHex?: any) => {
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
        setHistory(prev => [...prev, { type: "error", text: `Cestování se nezdařilo: ${data.detail || "Chyba serveru"}` }]);
      }
    } catch (e) {
      console.error(e);
      setHistory(prev => [...prev, { type: "error", text: "Chyba spojení se serverem při cestování." }]);
    } finally {
      setLoading(false);
    }
  };
  const handleCombatResolution = async () => {
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
        const charRes = await fetch(`${API_URL}/load`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, name: name })
        });
        if (charRes.ok) {
          const charData = await charRes.json();
          if (charData.state) {
            setHp(charData.state.hp ?? hp);
            setMaxHp(charData.state.maxHp ?? charData.state.max_hp ?? maxHp);
            setXp(charData.state.xp ?? xp);
            setGold(charData.state.gold ?? gold);
            setLevel(charData.state.level ?? level);
            if (charData.state.inventory) setInventory(charData.state.inventory);
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
               if (npc.text) {
                 const type = npc.pohlavi === "muz" ? "npc_muz" : "npc_zena";
                 audioQueue.push({text: npc.text, type});
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
                 setSkillPoints(sp => sp + 1);
                 setQuestBanner({
                   title: `POSTOUPIL JSI NA ÚROVEŇ ${nextLevel}!`,
                   subtitle: `+10 Max HP (vyléčen na ${nextMaxHp} HP) a získal jsi 1 dovednostní bod!`
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
        <div className="h-[100dvh] max-h-[100dvh] w-full max-w-full text-[#2d3748] flex flex-col items-center justify-center p-2 sm:p-4 font-serif relative overflow-hidden bg-[#e5dfc5]">
          {/* Audio toggle in top right corner of menu */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const nextState = !musicPlaying;
              setMusicPlaying(nextState);
              if (nextState && bgAudioRef.current) {
                bgAudioRef.current.play().catch(console.error);
              }
            }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 sm:px-3 sm:py-1.5 rounded-full bg-[#f9f6e6]/80 hover:bg-[#f9f6e6] border border-amber-900/20 text-slate-700 shadow-md backdrop-blur-sm transition flex items-center gap-2 text-xs font-cinzel cursor-pointer"
            title={musicPlaying ? "Vypnout hudbu" : "Zapnout hudbu"}
          >
            {musicPlaying ? <Volume2 size={16} className="text-amber-800" /> : <VolumeX size={16} className="text-slate-400" />}
            <span className="hidden sm:inline font-bold">{musicPlaying ? "Hudba hraje" : "Hudba vypnuta"}</span>
          </button>
        
        {/* Deep background fog */}
        <SeamlessVideo src="/video/bg1.mp4" className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#e5dfc5]/20 via-[#f9f6e6]/50 to-transparent z-0 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rpg-magic/10 blur-[120px] rounded-full z-0 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-5xl w-full z-10 relative flex flex-col items-center mx-auto my-auto shrink-0"
        >
          <div className="mb-2 sm:mb-3 text-center shrink-0">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-rpg-magic tracking-widest md:tracking-[0.2em] font-cinzel drop-shadow-[0_0_20px_rgba(197,160,89,0.5)]">
              AELTHGARD
            </h1>
            <p className="text-slate-700 font-lora text-xs sm:text-sm tracking-widest mt-1 uppercase">AI Dungeons & Dragons RPG</p>
          </div>

          {!isLoggedIn ? (
            <div className="w-full max-w-sm bg-[#f9f6e6]/60 backdrop-blur-md p-8 rounded-2xl border border-amber-900/10 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full p-3 bg-transparent border-b-2 border-amber-900/20 focus:border-rpg-magic outline-none text-[#2d3748] font-lora text-lg transition placeholder-slate-400" 
                    placeholder="E-mail" 
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full p-3 bg-transparent border-b-2 border-amber-900/20 focus:border-rpg-magic outline-none text-[#2d3748] font-lora text-lg transition placeholder-slate-400" 
                    placeholder="Heslo" 
                  />
                </div>
                
                <button 
                  onClick={() => handleAuth(isRegistering)}
                  disabled={loading || !email || !password}
                  className="w-full py-4 bg-white/50 border border-amber-900/50 text-slate-800 font-cinzel font-bold text-xl rounded-xl hover:bg-white/70 hover:shadow-[0_0_15px_rgba(197,160,89,0.4)] transition uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                >
                  {loading && <Loader2 size={24} className="animate-spin" />}
                  {isRegistering ? "Vytvořit Účet" : "Vstoupit"}
                </button>
                
                <div className="text-center mt-4">
                  <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-slate-600 hover:text-[#2d3748] font-lora transition"
                  >
                    {isRegistering ? "Zpět k přihlášení" : "Zaregistrovat se"}
                  </button>
                </div>
              </div>
            </div>
          ) : savedCharacters.length === 0 ? (
            <div className="text-center w-full max-w-sm bg-[#f9f6e6]/60 backdrop-blur-md p-8 rounded-2xl border border-amber-900/10 shadow-2xl">
              <p className="text-slate-700 font-lora mb-2 text-sm">Přihlášen: <span className="font-bold text-slate-900">{email}</span></p>
              {loading ? (
                <div className="py-8 flex flex-col items-center gap-3 text-rpg-magic font-cinzel">
                  <Loader2 size={32} className="animate-spin" />
                  <span>Načítám tvé hrdiny...</span>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-500 font-lora mb-6">Zatím nemáš vytvořenou žádnou postavu pro tento e-mail.</p>
                  <button 
                    onClick={() => setGameState("creation")}
                    className="w-full py-4 bg-rpg-blood border border-red-900/50 text-[#2d3748] font-cinzel font-bold text-xl rounded-xl hover:bg-red-800 hover:shadow-[0_0_20px_rgba(183,75,75,0.6)] transition uppercase tracking-widest"
                  >
                    Zrození Hrdiny
                  </button>
                  <div className="flex justify-between items-center mt-5 pt-3 border-t border-amber-900/10">
                    <button 
                      onClick={() => fetchCharacters(email)}
                      className="text-xs text-slate-600 hover:text-slate-900 font-lora transition flex items-center gap-1.5"
                    >
                      <RotateCcw size={13} /> Obnovit postavy
                    </button>
                    <button 
                      onClick={() => {
                        localStorage.removeItem("aethelgard_session_email");
                        localStorage.removeItem("aethelgard_active_char");
                        window.location.reload();
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-lora transition"
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
                onCreateNew={() => setGameState("creation")}
                getAvatarVideo={getAvatarVideo}
              />

              <button 
                onClick={() => {
                  localStorage.removeItem("aethelgard_session_email");
                  localStorage.removeItem("aethelgard_active_char");
                  window.location.reload();
                }}
                className="mt-2 px-4 py-1 text-slate-500 font-lora hover:text-slate-800 transition text-xs flex items-center gap-1 cursor-pointer shrink-0"
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
      <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#1b262c] p-1 md:p-6 gap-2 md:gap-4 font-serif flex flex-col items-center relative">
        <DeathModal onClose={() => {}} />

      
      {/* Patch Notes Modal */}
      <PatchNotesModal isOpen={patchNotesOpen} onClose={() => setPatchNotesOpen(false)} />

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* --- AELTHGARD IMMERSIVE GAMEPLAY UI --- */}
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${currentLocationImage || 'https://www.transparenttextures.com/patterns/black-scales.png'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f9f6e6]/95 via-[#f9f6e6]/70 to-[#f9f6e6]/30 backdrop-blur-sm" />
      </div>

      <div className="w-full max-w-7xl flex flex-col h-full relative z-10 p-2 md:p-8 pb-0">
        

        {/* Top HUD */}
        <div className="flex flex-col gap-2 md:gap-4 mb-2 md:mb-4 w-full max-w-5xl mx-auto z-10">
          
          <div className="flex items-center justify-between bg-[#f9f6e6]/60 backdrop-blur-md p-2 md:p-4 rounded-2xl border border-amber-900/10 shadow-lg">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-rpg-magic shadow-[0_0_10px_rgba(197,160,89,0.3)] shrink-0 hidden sm:block relative">
                <img src={`https://image.pollinations.ai/prompt/vibrant%20fable%20style%20magical%20fantasy%20portrait%20of%20a%20${encodeURIComponent(race)}%20${encodeURIComponent(dndClass)}%20RPG%20character?width=128&height=128&nologo=true&seed=42`} alt={name} className="w-full h-full object-cover" />
                {getAvatarVideo(race) && (
                  <SeamlessVideo src={getAvatarVideo(race)!} className="absolute inset-0 w-full h-full" />
                )}
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg sm:text-xl font-cinzel text-[#2d3748] font-bold drop-shadow-md leading-tight">{name} <span className="text-rpg-magic text-xs">Lv.{level}</span></h2>
                <div className="text-slate-700 font-lora text-xs flex items-center gap-1.5 flex-wrap">
                  <span>{race} {dndClass}</span>
                  {currentRegion && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="text-rpg-magic font-cinzel font-bold flex items-center gap-0.5"><MapPin size={11} /> {currentRegion}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2" title="Životy">
                <Heart size={16} className="text-rpg-blood" />
                <div className="font-cinzel text-[#2d3748] text-sm sm:text-base font-bold">
                  <span className={hp <= 20 ? 'text-rpg-blood animate-pulse' : ''}>{hp}</span><span className="text-slate-600 text-xs">/100</span>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2" title="Zásoby">
                <Drumstick size={16} className={rations < 2 ? "text-rpg-blood animate-pulse" : "text-orange-400"} />
                <div className="font-cinzel text-[#2d3748] text-sm sm:text-base font-bold">{rations}</div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2" title="Zlato">
                <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black text-[10px] shadow-[0_0_8px_rgba(234,179,8,0.5)]">Z</div>
                <div className="font-cinzel text-[#2d3748] text-sm sm:text-base font-bold">{gold}</div>
              </div>
            </div>

          </div>

          <div className="flex gap-1 sm:gap-2.5 bg-[#f9f6e6]/70 backdrop-blur-md border border-amber-900/15 p-1 sm:p-2 rounded-2xl shadow-xl overflow-x-auto custom-scrollbar hide-scrollbar snap-x flex-nowrap md:justify-center items-center">
            <button onClick={() => setStatsOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-2.5 text-slate-700 hover:text-amber-950 hover:bg-white/80 rounded-xl transition flex items-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold">
              <User size={17} className="text-amber-900" /> <span className="hidden sm:inline">Vlastnosti</span>
            </button>
            <button onClick={() => setInventoryOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-2.5 text-slate-700 hover:text-amber-950 hover:bg-white/80 rounded-xl transition flex items-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold">
              <Package size={17} className="text-amber-900" /> <span className="hidden sm:inline">Batoh</span>
            </button>
            
            {/* Dedicated Quests Button */}
            <button 
              onClick={() => { setQuestsOpen(true); setUnreadQuests(false); }} 
              className={`flex-shrink-0 snap-start p-2 sm:p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold relative ${
                unreadQuests 
                  ? 'bg-amber-200/90 text-amber-950 border border-amber-600/50 shadow-[0_0_12px_rgba(212,175,55,0.4)]' 
                  : 'text-slate-700 hover:text-amber-950 hover:bg-white/80'
              }`}
              title="Kniha úkolů"
            >
              <ScrollText size={17} className="text-amber-900" /> 
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

            {/* Journal Button */}
            <button 
              onClick={() => setJournalOpen(true)} 
              className="flex-shrink-0 snap-start p-2 sm:p-2.5 text-slate-700 hover:text-amber-950 hover:bg-white/80 rounded-xl transition flex items-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold"
              title="Kronika příběhu"
            >
              <BookOpen size={17} className="text-amber-900" /> <span className="hidden sm:inline">Deník</span>
            </button>

            {/* Skills Button */}
            <button 
              onClick={() => setSkillsOpen(true)} 
              className="flex-shrink-0 snap-start p-2 sm:p-2.5 text-slate-700 hover:text-amber-950 hover:bg-white/80 rounded-xl transition flex items-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold" 
              title="Dovednosti a kouzla"
            >
              <Sparkles size={17} className="text-amber-900" /> <span className="hidden sm:inline">Schopnosti</span>
            </button>

            {/* NPCs Button */}
            <button onClick={() => setNpcsOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-2.5 text-slate-700 hover:text-amber-950 hover:bg-white/80 rounded-xl transition flex items-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold">
              <Users size={17} className="text-amber-900" /> <span className="hidden sm:inline">Postavy</span>
            </button>

            {/* Map Button */}
            <button onClick={() => setMapOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-2.5 text-amber-900 hover:bg-amber-100/60 rounded-xl transition flex items-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold">
              <Map size={17} /> <span className="hidden sm:inline">Mapa</span>
            </button>

            {/* Settings Button */}
            <button onClick={() => setSettingsOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-2.5 text-slate-600 hover:text-amber-950 hover:bg-white/80 rounded-xl transition" title="Nastavení">
              <Settings2 size={17} />
            </button>

            {/* Back to Hero Selection */}
            <button 
              onClick={() => {
                localStorage.removeItem("aethelgard_active_char");
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                setGameState("menu");
                fetchCharacters(email);
              }} 
              className="flex-shrink-0 snap-start p-2 sm:p-2.5 text-red-700 hover:text-red-900 hover:bg-red-50/80 rounded-xl transition flex items-center gap-1.5 text-xs sm:text-sm font-cinzel font-bold border border-red-900/20" 
              title="Zpět do výběru hrdinů"
            >
              <Users size={16} /> <span className="hidden md:inline">Výběr hrdiny</span>
            </button>
          </div>
          
        </div>
        {inCombat ? (
          <div className="flex-1 overflow-hidden relative mb-4 w-full max-w-5xl mx-auto z-10">
            <CombatArena onVictory={handleCombatResolution} />
          </div>
        ) : (
          <>
            {/* Story Log (Middle) */}
            <div className="flex-1 overflow-hidden relative mb-4 w-full max-w-5xl mx-auto z-10">
              <div className="absolute inset-0 bg-[#f9f6e6]/70 backdrop-blur-lg border border-amber-900/10 rounded-2xl shadow-2xl p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6" >
                
                {history.map((msg, i) => (
                  <div key={i} className={`flex ${msg.type === "player" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] md:max-w-[75%] p-5 rounded-2xl ${
                      msg.type === "player" 
                        ? "bg-white/50 border border-amber-900/10 text-slate-800 font-lora" 
                        : msg.type === "system" || msg.type === "error"
                          ? "bg-[#f4ecd8] border border-amber-900/5 text-slate-700 font-cinzel text-sm italic"
                          : "bg-[#f9f6e6]/80 border border-rpg-magic/30 text-[#2d3748] font-lora shadow-[0_0_15px_rgba(197,160,89,0.1)]"
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
                              <button onClick={() => playAudio(msg.vypravec, 'narrator')} className="float-right ml-4 text-slate-600 hover:text-rpg-magic transition">
                                <Volume2 size={18} />
                              </button>
                              <TypewriterText text={msg.vypravec} animate={i === history.length - 1} />
                            </div>
                          )}
                          {msg.popis_okoli && (
                            <div className="text-slate-700 italic font-lora text-sm border-l-2 border-rpg-magic/50 pl-3">
                              {msg.popis_okoli}
                            </div>
                          )}
                          {msg.npc_dialogy && msg.npc_dialogy.length > 0 && (
                            <div className="flex flex-col gap-2 mt-2">
                              {msg.npc_dialogy.map((npc: any, nIdx: number) => (
                                <div key={nIdx} className="bg-[#f4ecd8]/90 p-3 rounded-lg border border-amber-900/10">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-rpg-magic font-cinzel">{npc.jmeno}</span>
                                    <button onClick={() => playAudio((npc.text || npc.replika), npc.pohlavi === 'zena' ? 'npc_zena' : 'npc_muz')} className="text-slate-600 hover:text-[#2d3748]"><Volume2 size={16} /></button>
                                  </div>
                                    <div className="text-slate-900">"{npc.text || npc.replika}"</div>
                                </div>
                              ))}
                            </div>
                          )}
                          {msg.system_log && (
                            <div className="text-xs font-mono mt-2 opacity-90 border-t border-amber-900/10 pt-2">
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
                    <div className="bg-[#f5eedc] border-2 border-amber-600/60 p-4 sm:p-5 rounded-2xl flex items-center gap-3.5 shadow-lg shadow-amber-900/10">
                      <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-amber-600 text-white shadow-md shrink-0">
                        <Sparkles className="animate-spin" size={18} />
                        <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-50" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-amber-950 font-cinzel font-bold text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                          Vypravěč přemýšlí a spřádá osud...
                        </span>
                        <span className="text-amber-800/80 font-lora text-xs italic">
                          Tvá volba právě mění chod příběhu
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {/* Embedded choices directly inside story log */}
                {!loading && !inCombat && suggestedActions.length > 0 && (
                  <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-amber-900/15">
                    <div className="text-xs font-cinzel text-slate-500 uppercase tracking-widest font-bold">
                      Možné volby:
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {suggestedActions.map((act, i) => (
                        <button
                          key={`chat-act-${i}`}
                          onClick={() => sendAction(act)}
                          className="w-full text-left bg-[#fcfaf2] hover:bg-amber-100/90 border-2 border-amber-900/15 hover:border-amber-600 hover:shadow-[0_4px_16px_rgba(180,83,9,0.25)] px-4 sm:px-5 py-3.5 rounded-xl text-slate-800 hover:text-amber-950 transition-all font-lora text-sm sm:text-base flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-amber-900/10 group-hover:bg-amber-700 group-hover:text-white flex items-center justify-center text-xs font-cinzel font-bold text-amber-900 transition-colors shrink-0">
                              {i + 1}
                            </span>
                            <span className="font-medium group-hover:font-bold transition-all">{act}</span>
                          </div>
                          <span className="opacity-0 group-hover:opacity-100 transition-all bg-amber-700 text-white px-3 py-1 rounded-lg font-cinzel text-xs font-bold shrink-0 ml-3 shadow-sm flex items-center gap-1 group-hover:translate-x-1">
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
            <div className="shrink-0 flex flex-col gap-4 pb-4 w-full max-w-5xl mx-auto px-2 sm:px-0">
              
              {/* Action Buttons & Dock */}
              <div className="flex flex-wrap justify-between items-end gap-4">
                
                {/* Contextual Actions */}
                <div className="flex flex-nowrap gap-2 flex-1 overflow-x-auto snap-x custom-scrollbar hide-scrollbar pb-2">
                    <>
                      {pointsOfInterest.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 py-1">
                          <span className="text-xs font-cinzel font-bold text-amber-950 flex items-center gap-1 uppercase tracking-wider mr-1">
                            <MapPin size={14} className="text-amber-700" /> Lokace v okolí:
                          </span>
                          {pointsOfInterest.map((poi, i) => (
                            <button 
                              key={`poi-${i}`} 
                              onClick={() => sendAction(`Jdu prozkoumat: ${poi.nazev}`)} 
                              className="bg-[#f2ece1] hover:bg-amber-100 border border-amber-900/30 hover:border-amber-700 text-slate-900 hover:text-amber-950 px-3.5 py-2 rounded-xl text-xs font-cinzel font-bold transition-all shadow-sm flex items-center gap-1.5"
                            >
                              <MapPin size={14} className="text-amber-700" />
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
                <div className="relative flex flex-row items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-xl p-2 sm:p-3 rounded-2xl border border-rpg-magic/30 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                  <button
                    onClick={() => setIsOOC(!isOOC)}
                    className={`p-2.5 sm:p-3.5 transition-all rounded-xl flex items-center justify-center shrink-0 cursor-pointer ${isOOC ? 'bg-indigo-900/40 text-indigo-800 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'text-slate-600 hover:text-rpg-magic bg-white/50 border border-transparent'}`}
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
                    className={`flex-1 min-w-0 font-lora text-sm sm:text-lg bg-transparent px-2 sm:px-3 py-2 outline-none transition-colors ${isOOC ? 'text-indigo-900 placeholder-indigo-400' : 'text-[#2d3748] placeholder-gray-500'}`}
                    disabled={loading}
                  />
                  <button 
                    onClick={() => sendAction(customAction)}
                    className="bg-rpg-blood hover:bg-red-800 text-white px-3.5 sm:px-8 py-2.5 sm:py-3 shrink-0 rounded-xl font-cinzel font-bold text-sm sm:text-base tracking-wider sm:tracking-widest transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 sm:gap-2 shadow-[0_0_15px_rgba(183,75,75,0.4)] cursor-pointer"
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
          </>
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

      {/* Inventory Modal */}
      <InventoryPanel 
        isOpen={inventoryOpen} 
        onClose={() => setInventoryOpen(false)} 
        selectedItem={selectedItem} 
        setSelectedItem={setSelectedItem} 
      />

      {/* Atmospheric Quest Notification Banner */}
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
