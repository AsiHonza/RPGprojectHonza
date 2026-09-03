"use client";

import HexMap from "../components/map/HexMap";
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from "react";
import { useGameStore } from '../store/gameStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

import { ItemIcon } from '../components/ui/ItemIcon';
import { InventoryPanel } from '../features/character/InventoryPanel';
import ReactPlayer from 'react-player';
import { Send, Heart, Flame, Package, Sword, Shield, FlaskConical, Gem, Shirt, ScrollText, X, Volume2, VolumeX, User, Users, Settings2, Map, Sparkles, Skull, BookOpen, MapPin, Drumstick, Mail, Loader2, Trash2 , Brain , Menu } from "lucide-react";
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
import { PATCH_NOTES } from '../data/patchNotes';

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
        .replace(/(Úspěch\.|Úspěch!|Úspěch:?)/gi, '<span class="text-green-700 font-bold">$1</span>')
        .replace(/(Selhání\.|Selhání!|Selhání:?)/gi, '<span class="text-red-700 font-bold">$1</span>')
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
  const { bgVolume, setBgVolume, currentTrack, setCurrentTrack, ttsVolume, setTtsVolume, musicPlaying, setMusicPlaying, unreadQuests, setUnreadQuests, gameState, setGameState, loading, setLoading, name, setName, dndClass, setDndClass, race, setRace, stats, setStats, keywords, setKeywords, gameMode, setGameMode, backstory, setBackstory, hp, setHp, level, setLevel, xp, setXp, gold, setGold, rations, setRations, skillPoints, setSkillPoints, inventory, setInventory, equipped, setEquipped, worldData, setWorldData, journal, setJournal, quests, setQuests, npcs, setNpcs, currentRegion, setCurrentRegion, locationType, setLocationType, currentSpellSlots, setCurrentSpellSlots, maxSpellSlots, setMaxSpellSlots, skills, setSkills, availableSkills, setAvailableSkills, inCombat, setInCombat, enemies, setEnemies , setPlayerLocation, setDay } = useGameStore();


  const [actionsOpen, setActionsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Character Creation Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Game Play State
  const [savedCharacters, setSavedCharacters] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
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
  const [currentLocationImage, setCurrentLocationImage] = useState<string | null>(null);
  const [currentLocationDesc, setCurrentLocationDesc] = useState<string>("");
  const [travelMode, setTravelMode] = useState(false);
  const [travelDaysLeft, setTravelDaysLeft] = useState(0);
  const [travelDestination, setTravelDestination] = useState("");
  const [npcsOpen, setNpcsOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);


  const [pointsOfInterest, setPointsOfInterest] = useState<{nazev: string, ikona: string, ma_ukol: boolean}[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentImageError, setCurrentImageError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [questBanner, setQuestBanner] = useState<{title: string, subtitle: string} | null>(null);
  
  const prevQuestsRef = useRef(quests);
  useEffect(() => {
    const prev = prevQuestsRef.current;
    if (prev.length > 0 || quests.length > 0) {
      if (JSON.stringify(prev) !== JSON.stringify(quests)) {
        setUnreadQuests(true);
        const newQuest = quests.find(q => !prev.some(pq => pq.id === q.id));
        if (newQuest) {
           setQuestBanner({title: "ÚKOL PŘIJAT", subtitle: newQuest.nazev});
        } else {
           const completedQuest = quests.find(q => (q.stav === 'splněno' || q.stav === 'splneno') && prev.some(pq => pq.id === q.id && pq.stav !== 'splněno' && pq.stav !== 'splneno'));
           if (completedQuest) {
              setQuestBanner({title: "ÚKOL SPLNĚN", subtitle: completedQuest.nazev});
           } else {
              setQuestBanner({title: "DENÍK ÚKOLŮ AKTUALIZOVÁN", subtitle: ""});
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
  
  // Global interaction listener for Autoplay Policy
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (musicPlaying && bgAudioRef.current && bgAudioRef.current.paused) {
        bgAudioRef.current.play().catch(e => console.log("Autoplay still blocked:", e));
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [musicPlaying]);

  // Dynamic Music switching
  useEffect(() => {
    if (!musicPlaying || !bgAudioRef.current) return;
    
    let newTrack = "/ambient.mp3";
    
    if (gameState === "menu" || gameState === "creation") {
      newTrack = "/music/theme.mp3";
    } else {
      if (inCombat) {
        newTrack = "/music/combat1.mp3";
      } else {
        if (locationType === "mesto") newTrack = "/music/city1.mp3";
        else if (locationType === "podzemi") newTrack = "/ambient.mp3"; // Fallback pro jeskyně, dokud nepřidáš dungeon.mp3
        else if (locationType === "divocina") newTrack = "/music/wilds1.mp3";
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
            }).catch(e => console.error("Audio crossfade blocked", e));
          }, 100);
        }
      }, 150);
    }
  }, [locationType, inCombat, musicPlaying, gameState]);


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
  }, [musicPlaying, bgVolume]);

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
            hp, inventory, equipped, level, xp, skillPoints, skills, inCombat, enemies, quests,
            locationType, currentRegion, pointsOfInterest, stats, rations, currentImage, currentImageError, currentLocationDesc, travel_mode: travelMode, travel_days_left: travelDaysLeft, travel_destination: travelDestination, zname_postavy: npcs, world_data: worldData
          }
        }),
      }).catch(err => console.error("Autosave failed", err));
    }, 2000);
    return () => clearTimeout(timer);
  }, [hp, inventory, equipped, level, xp, skillPoints, skills, inCombat, enemies, quests, locationType, currentRegion, pointsOfInterest, gameState, stats, gold, currentSpellSlots, maxSpellSlots, rations, currentImage, currentImageError, travelMode, travelDaysLeft, travelDestination, npcs, worldData]);

  const playAudio = (text: string, voiceType: "narrator" | "npc_muz" | "npc_zena" = "narrator"): Promise<void> => {
    return new Promise((resolve) => {
      let voice = "cs-CZ-AntoninNeural";
      if (voiceType === "npc_zena") voice = "cs-CZ-VlastaNeural";
      if (voiceType === "npc_muz") voice = "cs-CZ-AntoninNeural";

              const url = `${API_URL}/tts?text=${encodeURIComponent(text)}&voice=${voice}`;
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
    if (savedEmail) {
      setEmail(savedEmail);
      setIsLoggedIn(true);
      fetchCharacters(savedEmail);
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

  const loadGame = async (characterName: string) => {
    if (!email || !characterName) return alert("Přihlaste se a vyberte postavu!");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/load-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, api_key: "DUMMY", name: characterName }),
      });
      const data = await res.json();
      
      if (res.ok) {
                setName(data.character.name);
        setRace(data.character.race);
        setDndClass(data.character.dnd_class);
        
        let lastSuggestedActions: string[] = [];
        let lastImage = null;
        let lastDesc = "";
        
        const loadedHistory = data.character.history.map((msg: any) => {
          if (msg.role === "user") {
            return { type: "player", text: msg.text };
          }
          if (msg.role === "model") {
            try {
              const dm_data = JSON.parse(msg.text);
              if (dm_data.nabizene_akce) lastSuggestedActions = dm_data.nabizene_akce;
              if (dm_data.image_prompt) lastImage = dm_data.image_prompt;
              if (dm_data.popis_okoli) lastDesc = dm_data.popis_okoli;
              
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
              return { type: "error", text: "Chybný formát zprávy z historie." };
            }
          }
          return null;
        }).filter(Boolean);
        
        setHistory(loadedHistory);
        setSuggestedActions(lastSuggestedActions);
        
        const state = data.character.state || {};
        setHp(state.hp || 100);
        if (state.gold !== undefined) setGold(state.gold);
        if (state.currentSpellSlots !== undefined) setCurrentSpellSlots(state.currentSpellSlots);
        if (state.maxSpellSlots !== undefined) setMaxSpellSlots(state.maxSpellSlots);
        setInventory(state.inventory || []);
        setEquipped(state.equipped || {
          "hlava": null,
          "hruď": null,
          "hlavní ruka": null,
          "druhá ruka": null,
          "prsten": null,
          "krk": null
        });
        
        
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
        setQuests(state.quests || []);
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


        if (state.currentLocationDesc) setCurrentLocationDesc(state.currentLocationDesc);
        if (state.popis_okoli) setCurrentLocationDesc(state.popis_okoli);
        if (state.pointsOfInterest) setPointsOfInterest(state.pointsOfInterest);
        if (state.currentImage) setCurrentImage(state.currentImage.startsWith("http") && !state.currentImage.includes("127.0.0.1") ? state.currentImage : (state.currentImage.includes("127.0.0.1") ? state.currentImage.replace("http://127.0.0.1:8000", API_URL) : `${API_URL}${state.currentImage}`));
        if (state.currentImageError) setCurrentImageError(state.currentImageError);

        setGameState("playing");
        
        if (lastDesc) {
            playAudioSequentially([{text: lastDesc, type: "narrator"}]);
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
      } else {
        alert(data.detail || "Chyba při tvorbě.");
      }
    } catch (e) {
      alert("Nelze se připojit k serveru.");
    }
    setLoading(false);
  };


  const handleTravel = async (q: number, r: number) => {
    try {
      setLoading(true);
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
        setPlayerLocation(data.state.playerLocation);
        setDay(data.state.day);
        setRations(data.state.rations);
        setHp(data.state.hp);
        
        // Push the narrative text to history directly so the player sees it
        setHistory(prev => [...prev, { type: "system", text: data.narrative }]);
        
        // Generate TTS for narrative
        playAudio(data.narrative, "narrator");
        
        // Close map
        setMapOpen(false);
      } else {
        alert("Chyba při cestování: " + data.detail);
      }
    } catch (e) {
      console.error(e);
      alert("Chyba spojení.");
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
        
        if (data.v_boji !== undefined) setInCombat(data.v_boji);

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
          if (data.zmeny_stavu.zivoty_zmena) setHp(h => Math.max(0, h + data.zmeny_stavu.zivoty_zmena));
          if (data.zmeny_stavu.xp_zmena) {
             setXp(currentXp => {
               const newXp = currentXp + data.zmeny_stavu.xp_zmena;
               if (newXp >= level * 300) {
                 // Level up!
                 setLevel(l => l + 1);
                 setSkillPoints(sp => sp + 1);
                 return newXp - (level * 300);
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
                   const idx = updated.findIndex(existing => existing.id === u.id);
                   if (idx !== -1) updated[idx] = u;
                   else updated.push(u);
                }
                return updated;
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

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-[#e5dfc5] text-[#2d3748] flex items-center justify-center p-4 font-serif relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]">
        
        {/* Deep background fog */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-950/80 to-slate-950 z-0 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rpg-magic/10 blur-[120px] rounded-full z-0 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full z-10 relative flex flex-col items-center"
        >
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-rpg-magic tracking-widest md:tracking-[0.2em] font-cinzel drop-shadow-[0_0_20px_rgba(197,160,89,0.5)]">
              AELTHGARD
            </h1>
            <p className="text-slate-700 font-lora text-xl tracking-widest mt-4 uppercase">AI Dungeons & Dragons RPG</p>
          </div>

          {!isLoggedIn ? (
            <div className="w-full max-w-sm bg-[#f9f6e6]/60 backdrop-blur-md p-8 rounded-2xl border border-amber-900/10 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full p-3 bg-transparent border-b-2 border-amber-900/20 focus:border-rpg-magic outline-none text-[#2d3748] font-lora text-lg transition placeholder-white/30" 
                    placeholder="E-mail" 
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full p-3 bg-transparent border-b-2 border-amber-900/20 focus:border-rpg-magic outline-none text-[#2d3748] font-lora text-lg transition placeholder-white/30" 
                    placeholder="Heslo" 
                  />
                </div>
                
                <button 
                  onClick={() => handleAuth(isRegistering)}
                  disabled={loading || !email || !password}
                  className="w-full py-4 bg-white/50 border border-rpg-magic/50 text-rpg-magic font-cinzel font-bold text-xl rounded-xl hover:bg-rpg-magic/20 hover:shadow-[0_0_15px_rgba(197,160,89,0.4)] transition uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
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
              <p className="text-slate-700 font-lora mb-6">Přihlášen: {email}</p>
              <button 
                onClick={() => setGameState("creation")}
                className="w-full py-4 bg-rpg-blood border border-red-900/50 text-[#2d3748] font-cinzel font-bold text-xl rounded-xl hover:bg-red-800 hover:shadow-[0_0_20px_rgba(183,75,75,0.6)] transition uppercase tracking-widest"
              >
                Zrození Hrdiny
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-8">
              <div className="text-center">
                <h3 className="text-slate-700 font-lora text-lg">Tvé Legendy</h3>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-rpg-magic to-transparent mx-auto mt-2" />
              </div>

              <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-6 w-[100vw] sm:w-full max-w-7xl pb-8 px-4 custom-scrollbar justify-start items-center">
                {savedCharacters.map((char, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative w-64 h-96 shrink-0 bg-[#f9f6e6]/80 backdrop-blur-md border border-amber-900/10 rounded-2xl overflow-hidden cursor-pointer hover:border-rpg-magic transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(197,160,89,0.3)]"
                    onClick={() => loadGame(char.name)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                    
                    <img 
                      src={`https://image.pollinations.ai/prompt/vibrant%20fable%20style%20magical%20fantasy%20portrait%20of%20a%20${encodeURIComponent(char.race)}%20${encodeURIComponent(char.dnd_class)}%20RPG%20character?width=512&height=768&nologo=true&seed=${char.name.length * 42}`} 
                      alt={char.name} 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" 
                    />
                    
                    <div className="absolute inset-0 z-20 flex flex-col p-6">
                      <div className="absolute top-4 right-4 z-50">
                        <button 
                          onClick={(e) => deleteCharacter(e, char.name)}
                          className="p-2 text-[#2d3748]/50 hover:text-rpg-blood hover:bg-red-900/30 rounded-full transition"
                          title="Smazat postavu"
                        >
                          <Flame size={20} />
                        </button>
                      </div>
                      
                      <div className="mt-auto">
                        <h4 className="text-2xl font-cinzel font-bold text-[#2d3748] group-hover:text-rpg-magic transition drop-shadow-lg">{char.name}</h4>
                        <div className="text-rpg-magic font-lora italic mt-1 drop-shadow-md">{char.race} {char.dnd_class}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => setGameState("creation")}
                className="mt-4 px-8 py-3 bg-transparent border border-amber-900/20 text-[#2d3748] font-cinzel rounded-xl hover:bg-white/50 hover:border-amber-900/50 transition uppercase tracking-widest text-sm flex items-center gap-2"
              >
                <Sparkles size={16} />
                Vytvořit Novou Legendu
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  if (gameState === "creation") {
    return <CharacterCreation startNewGame={startNewGame} loading={loading}  backstory={backstory} generateBackstory={generateBackstory} />;
  }


  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#1b262c] p-1 md:p-6 gap-2 md:gap-4 font-serif flex flex-col items-center relative">

      
      {/* Patch Notes Modal */}
      <PatchNotesModal isOpen={patchNotesOpen} onClose={() => setPatchNotesOpen(false)} />

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#f4f1e1] border-2 border-[#b74b4b] rounded p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-[#90a4ae] pb-2">
              <h2 className="text-2xl font-bold text-[#2b4c5e] flex items-center gap-2"><Settings2 size={24} /> Nastavení</h2>
              <button onClick={() => setSettingsOpen(false)} className="text-[#b74b4b] hover:text-[#8a3333]"><X size={24} /></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-[#2b4c5e] font-bold mb-2">
                  <span>Hudba pozadí</span>
                  <span>{Math.round(bgVolume * 100)}%</span>
                </label>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={bgVolume} 
                  onChange={(e) => setBgVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#b74b4b]"
                />
              </div>
              <div>
                <label className="flex justify-between text-[#2b4c5e] font-bold mb-2">
                  <span>Hlas vypravěče</span>
                  <span>{Math.round(ttsVolume * 100)}%</span>
                </label>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={ttsVolume} 
                  onChange={(e) => setTtsVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#b74b4b]"
                />
              
              <div className="pt-4 mt-6 border-t border-[#90a4ae]">
                <a href="mailto:janmlcak6@gmail.com?subject=Zpětná vazba - Aethelgard" className="w-full py-2 bg-[#2b4c5e] text-[#f4f1e1] rounded font-bold hover:bg-[#1e3746] transition flex justify-center items-center gap-2">
                  <Mail size={18} /> Odeslat zpětnou vazbu
                </a>
              </div>
</div>
            </div>
          </div>
        </div>
      )}

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
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-rpg-magic shadow-[0_0_10px_rgba(197,160,89,0.3)] shrink-0 hidden sm:block">
                <img src={`https://image.pollinations.ai/prompt/vibrant%20fable%20style%20magical%20fantasy%20portrait%20of%20a%20${encodeURIComponent(race)}%20${encodeURIComponent(dndClass)}%20RPG%20character?width=128&height=128&nologo=true&seed=42`} alt={name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg sm:text-xl font-cinzel text-[#2d3748] font-bold drop-shadow-md leading-tight">{name} <span className="text-rpg-magic text-xs">Lv.{level}</span></h2>
                <div className="text-slate-700 font-lora text-xs">
                  {race} {dndClass}
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

          <div className="flex gap-1 sm:gap-4 bg-[#f9f6e6]/60 backdrop-blur-md border border-amber-900/10 p-1 sm:p-2 md:p-3 rounded-2xl shadow-xl overflow-x-auto custom-scrollbar hide-scrollbar snap-x flex-nowrap md:justify-center">
            <button onClick={() => setStatsOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-3 text-slate-700 hover:text-[#2d3748] hover:bg-white/70 rounded-xl transition flex items-center gap-2 text-sm font-cinzel"><User size={18} /> <span className="hidden sm:inline">Vlastnosti</span></button>
            <button onClick={() => setInventoryOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-3 text-slate-700 hover:text-[#2d3748] hover:bg-white/70 rounded-xl transition flex items-center gap-2 text-sm font-cinzel"><Package size={18} /> <span className="hidden sm:inline">Batoh</span></button>
            <button onClick={() => setJournalOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-3 text-slate-700 hover:text-[#2d3748] hover:bg-white/70 rounded-xl transition flex items-center gap-2 text-sm font-cinzel relative">
              <BookOpen size={18} /> <span className="hidden sm:inline">Deník</span>
              {unreadQuests && <span className="absolute top-1 right-1 w-2 h-2 bg-rpg-blood rounded-full animate-pulse" />}
            </button>
            <button onClick={() => setNpcsOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-3 text-slate-700 hover:text-[#2d3748] hover:bg-white/70 rounded-xl transition flex items-center gap-2 text-sm font-cinzel"><Users size={18} /> <span className="hidden sm:inline">Postavy</span></button>
            <button onClick={() => setMapOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-3 text-rpg-magic hover:bg-rpg-magic/20 rounded-xl transition flex items-center gap-2 text-sm font-cinzel"><Map size={18} /> <span className="hidden sm:inline">Mapa</span></button>
            <button onClick={() => setSettingsOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-3 text-slate-600 hover:text-[#2d3748] hover:bg-white/70 rounded-xl transition"><Settings2 size={18} /></button>
          </div>
          
        </div>
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
                                <button onClick={() => playAudio(npc.replika, npc.jmeno.toLowerCase().includes('žen') ? 'npc_zena' : 'npc_muz')} className="text-slate-600 hover:text-[#2d3748]"><Volume2 size={16} /></button>
                              </div>
                              <div className="text-slate-900">"{npc.replika}"</div>
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
              <div className="flex justify-start animate-fade-in-up">
                <div className="bg-[#f9f6e6]/80 border border-rpg-magic/30 p-5 rounded-2xl flex items-center gap-3 text-rpg-magic italic font-lora">
                  <Sparkles className="animate-spin" size={20} />
                  <span>Vypravěč spřádá osud...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Bottom Actions & Input */}
        <div className="shrink-0 flex flex-col gap-4 pb-4">
          
          {/* Action Buttons & Dock */}
          <div className="flex flex-wrap justify-between items-end gap-4">
            
            {/* Contextual Actions */}
            <div className="flex flex-nowrap gap-2 flex-1 overflow-x-auto snap-x custom-scrollbar hide-scrollbar pb-2">
              {inCombat ? (
                <>
                  <button onClick={() => sendAction(`Útočím zbraní: ${inventory.find(i => i.id === equipped["hlavní ruka"])?.name || "Pěsti"}`)} className="bg-rpg-blood/20 border border-rpg-blood text-[#2d3748] px-4 py-2 rounded-xl text-sm hover:bg-rpg-blood transition shadow-[0_0_10px_rgba(183,75,75,0.2)] font-cinzel flex items-center gap-2">
                    <Sword size={16} /> Útok
                  </button>
                  <button onClick={() => setSkillsOpen(true)} className="flex-shrink-0 snap-start whitespace-nowrap bg-white/50 border border-amber-900/20 text-[#2d3748] px-4 py-3 rounded-xl text-sm hover:bg-white/70 transition font-cinzel flex items-center gap-2">
                    <Sparkles size={16} /> Dovednost
                  </button>
                  <button onClick={() => sendAction("Pokusím se z boje utéct!")} className="flex-shrink-0 snap-start whitespace-nowrap bg-[#f9f6e6]/60 border border-amber-900/20 text-slate-700 px-4 py-3 rounded-xl text-sm hover:text-[#2d3748] transition font-cinzel italic">
                    Útěk
                  </button>
                </>
              ) : (
                <>
                  {locationType === 'mesto' && pointsOfInterest.map((poi, i) => (
                    <button key={`poi-${i}`} onClick={() => sendAction(`Jdu prozkoumat: ${poi.nazev}`)} className="flex-shrink-0 snap-start whitespace-nowrap bg-rpg-magic/10 border border-rpg-magic/50 text-rpg-magic px-4 py-3 rounded-xl text-sm hover:bg-rpg-magic hover:text-black transition font-cinzel flex items-center gap-2 shadow-[0_0_10px_rgba(197,160,89,0.2)]">
                      <MapPin size={16} /> {poi.nazev}
                    </button>
                  ))}
                  {suggestedActions.map((act, i) => (
                    <button key={`act-${i}`} onClick={() => sendAction(act)} className="flex-shrink-0 snap-start bg-white/50 border border-amber-900/20 text-slate-800 px-4 py-3 rounded-xl text-sm whitespace-nowrap shadow-sm max-w-[85vw] overflow-hidden text-ellipsis hover:bg-white/70 hover:text-[#2d3748] transition font-lora">
                      {act}
                    </button>
                  ))}
                </>
              )}
            </div>


          </div>

          {/* Magical Input Box */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-rpg-magic/20 to-transparent rounded-2xl blur-md" />
            <div className="relative flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 bg-white/90 backdrop-blur-xl p-2 sm:p-3 rounded-2xl border border-rpg-magic/30 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              <button
                onClick={() => setIsOOC(!isOOC)}
                className={`p-4 transition-all rounded-xl flex items-center justify-center ${isOOC ? 'bg-indigo-900/40 text-indigo-800 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'text-slate-600 hover:text-rpg-magic bg-white/50 border border-transparent'}`}
                title="OOC (Myšlenka)"
              >
                <Brain size={24} className={isOOC ? "animate-pulse" : ""} />
              </button>
              <input 
                type="text" 
                value={customAction}
                onChange={(e) => setCustomAction(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendAction(customAction)}
                placeholder={isOOC ? "Přemýšlím nad..." : "Co uděláš dál?"} 
                className={`flex-1 font-lora text-xl bg-transparent px-4 py-2 outline-none transition-colors ${isOOC ? 'text-indigo-900 placeholder-indigo-900' : 'text-[#2d3748] placeholder-gray-600'}`}
                disabled={loading}
              />
              <button 
                onClick={() => sendAction(customAction)}
                className="bg-rpg-blood hover:bg-red-800 text-[#2d3748] px-4 sm:px-8 py-2 sm:py-3 w-full sm:w-auto rounded-xl font-cinzel font-bold text-lg tracking-widest transition-all disabled:opacity-50 flex items-center justify-center shadow-[0_0_15px_rgba(183,75,75,0.4)]"
                disabled={loading || !customAction.trim()}
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : "Vydat se"}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Stats Modal */}
      {statsOpen && (
        <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-[#2b4c5e] rounded-lg border-4 border-[#90a4ae] shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-[#e3dcc8] p-4 flex justify-between items-center border-b-4 border-[#90a4ae]">
              <div className="flex items-center gap-2 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest">
                <User size={28} /> Vlastnosti
              </div>
              <button onClick={() => setStatsOpen(false)} className="text-[#2b4c5e] hover:text-[#b74b4b] transition">
                <X size={28} />
              </button>
            </div>
            
            <div className="p-6 bg-[#1e3746] flex flex-col gap-6">
              <div className="flex justify-between items-center bg-[#1b262c] border-2 border-[#455a64] p-4 rounded text-[#90a4ae]">
                <div>
                  <h3 className="font-bold text-lg text-[#f4f1e1]">Základní atributy</h3>
                  <p className="text-sm">Vylepšete si statistiky pro hody kostkou.</p>
                </div>
                <div className="text-right">
                  <div className="text-sm">Nevyužité body</div>
                  <div className="text-2xl font-bold text-[#d4af37]">{skillPoints}</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { key: 'str', label: 'Síla (STR)' },
                  { key: 'dex', label: 'Obratnost (DEX)' },
                  { key: 'con', label: 'Odolnost (CON)' },
                  { key: 'intel', label: 'Inteligence (INT)' },
                  { key: 'wis', label: 'Moudrost (WIS)' },
                  { key: 'cha', label: 'Charisma (CHA)' },
                ].map((stat) => (
                  <div key={stat.key} className="flex justify-between items-center bg-[#2b4c5e] p-3 rounded border border-[#455a64]">
                    <span className="font-bold text-[#f4f1e1] uppercase w-1/2">{stat.label}</span>
                    <span className="font-bold text-[#90a4ae] text-xl w-1/4 text-center">{stats[stat.key as keyof typeof stats]}</span>
                    <button 
                      onClick={() => {
                        if (skillPoints > 0) {
                          setStats({ ...stats, [stat.key]: stats[stat.key as keyof typeof stats] + 1 });
                          setSkillPoints(p => p - 1);
                        }
                      }}
                      disabled={skillPoints <= 0}
                      className="bg-[#d4af37] text-[#1b262c] font-bold w-8 h-8 rounded flex items-center justify-center hover:bg-[#f4f1e1] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      
      {/* Journal Modal */}
        <JournalModal isOpen={journalOpen} onClose={() => setJournalOpen(false)} />

      {/* Skills Modal */}
      <SkillsModal isOpen={skillsOpen} onClose={() => setSkillsOpen(false)}  setCustomAction={setCustomAction} />

      {/* Quests Modal */}
        <QuestsModal isOpen={questsOpen} onClose={() => setQuestsOpen(false)} />

      
        
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
      {questBanner && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
           <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center bg-white/80 px-12 py-6 border-y-4 border-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.4)] backdrop-blur-sm">
             <div className="text-[#d4af37] text-xs sm:text-sm font-bold tracking-[0.4em] uppercase mb-2">{questBanner.title}</div>
             <div className="text-[#f4f1e1] text-xl sm:text-3xl font-serif drop-shadow-lg text-center max-w-md">{questBanner.subtitle}</div>
           </div>
        </div>
      )}

      {/* Nativní HTML5 Přehrávač (Ambient Hudba) s lokálním m4a souborem */}
      <audio ref={bgAudioRef} src={currentTrack} loop onError={() => { if (currentTrack !== "/ambient.mp3") setCurrentTrack("/ambient.mp3"); }} />

    </div>
  );
}
