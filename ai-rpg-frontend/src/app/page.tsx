"use client";

import HexMap from "../components/map/HexMap";
import { useState, useRef, useEffect } from "react";
import { useGameStore } from '../store/gameStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

import { ItemIcon } from '../components/ui/ItemIcon';
import { InventoryPanel } from '../features/character/InventoryPanel';
import ReactPlayer from 'react-player';
import { Send, Heart, Package, Sword, Shield, FlaskConical, Gem, Shirt, ScrollText, X, Volume2, VolumeX, User, Users, Settings2, Map, Sparkles, Skull, BookOpen, MapPin, Drumstick, Mail, Loader2, Trash2 , Brain , Menu } from "lucide-react";
import { CharacterCreation } from '../features/character/CharacterCreation';
import { MapModal } from '../features/map/MapModal';
import { QuestsModal } from '../features/character/QuestsModal';
import { JournalModal } from '../features/character/JournalModal';
import { NpcsModal } from '../features/character/NpcsModal';
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
  // Split by lines first
  const lines = text.split('\n').map((line, idx) => {
    // Basic regex highlights
    let html = line
      .replace(/(Selhání\.|Selhání!)/gi, '<span class="text-red-600 font-bold">$1</span>')
      .replace(/(Úspěch\.|Úspěch!|Kritický úspěch!)/gi, '<span class="text-green-600 font-bold">$1</span>')
      .replace(/(Hráč ztrácí \d+ HP|ztrácíš \d+ HP|způsobuje \d+ bodů.*poškození)/gi, '<span class="text-red-600 font-bold">$1</span>')
      .replace(/(d\d+\(\d+\))/g, '<span class="text-yellow-600 font-bold">$1</span>')
      .replace(/(\d+ vs DC \d+)/g, '<span class="text-yellow-600 font-bold">$1</span>')
      .replace(/(vs AC \d+)/g, '<span class="text-yellow-600 font-bold">$1</span>')
      .replace(/(Útok vlka|Útok nepřítele|Útok skřeta|Útok orka)/gi, '<span class="text-red-500 font-bold">$1</span>')
      .replace(/(Útok hráče.*?:)/gi, '<span class="text-green-500 font-bold">$1</span>')
      .replace(/(Zásah!)/g, '<span class="font-bold border-b-2 border-red-400">$1</span>'); // Universal highlight for hits
    
    return (
      <div key={idx} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: html }} />
    );
  });
  return <div className="font-serif text-base text-[#2b4c5e]">{lines}</div>;
};



export default function Home() {
  const { gameState, setGameState, loading, setLoading, name, setName, dndClass, setDndClass, race, setRace, stats, setStats, keywords, setKeywords, gameMode, setGameMode, backstory, setBackstory, hp, setHp, level, setLevel, xp, setXp, gold, setGold, rations, setRations, skillPoints, setSkillPoints, inventory, setInventory, equipped, setEquipped, worldData, setWorldData, journal, setJournal, quests, setQuests, npcs, setNpcs, currentRegion, setCurrentRegion, locationType, setLocationType, currentSpellSlots, setCurrentSpellSlots, maxSpellSlots, setMaxSpellSlots, skills, setSkills, availableSkills, setAvailableSkills, inCombat, setInCombat, enemies, setEnemies } = useGameStore();

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
  const [bgVolume, setBgVolume] = useState(0.2);
  const [currentTrack, setCurrentTrack] = useState("/ambient.mp3");
  const [ttsVolume, setTtsVolume] = useState(1.0);
  
  // Nové stavy pro boj a RPG systém
  
  // Quests
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [questsOpen, setQuestsOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(true);
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
  const [unreadQuests, setUnreadQuests] = useState(false);
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
    
    
        setGameState("playing");

    setHistory([{ type: "system", text: `Postava ${name} vytvořena. Vstupuješ do světa...` }]);

    
      try {
        const res = await fetch(`${API_URL}/create-character`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, dnd_class: dndClass, race, stats, email: email, api_key: "DUMMY", game_mode: gameMode }),
        });
        const data = await res.json();
        
        if (res.ok) {
          setHistory([
            { type: "system", text: data.message },
            { type: "dm", popis_okoli: data.popis_okoli, vypravec: data.intro_text }
          ]);
          setSuggestedActions(["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"]);
          setCurrentLocationDesc(data.popis_okoli || "Neznámé místo.");
          setCurrentRegion("Začátek cesty");

          // Load the character to fetch full state including generated world_data
          await loadGame(name);
          
          setGameState("playing");
        } else {
          alert(data.detail || "Chyba při tvorbě.");
          setGameState("menu");
        }
      } catch (e) {
        alert("Nelze se připojit k serveru.");
        setGameState("menu");
      }
      setLoading(false);

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
      <div className="min-h-screen bg-[#1b262c] flex items-center justify-center p-4 font-serif">
        <div className="max-w-md w-full bg-[#f4f1e1] rounded shadow-2xl p-8 border border-[#90a4ae] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#b74b4b] to-transparent"></div>
          <h1 className="text-4xl font-bold text-center text-[#2b4c5e] mb-2 tracking-wider font-medieval">AETHELGARD</h1>
          <p className="text-center text-[#455a64] italic mb-8">AI Dungeons & Dragons RPG</p>
          
          <div className="space-y-4">
            {!isLoggedIn ? (
              <>
                <div>
                  <label className="block font-bold mb-1 text-sm text-[#2b4c5e]">E-mail</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full p-2 bg-[#e3dcc8] border border-[#90a4ae] rounded outline-none focus:ring-2 focus:ring-[#b74b4b] mb-4 text-[#2b4c5e]" 
                    placeholder="tvuj@email.cz" 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-sm text-[#2b4c5e]">Heslo</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full p-2 bg-[#e3dcc8] border border-[#90a4ae] rounded outline-none focus:ring-2 focus:ring-[#b74b4b] mb-4 text-[#2b4c5e]" 
                    placeholder="Heslo" 
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => handleAuth(isRegistering)}
                    disabled={loading || !email || !password}
                    className="w-full py-3 bg-[#b74b4b] border-2 border-[#b74b4b] text-[#f4f1e1] font-bold rounded hover:bg-[#d46a6a] transition uppercase tracking-widest shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 size={20} className="animate-spin" />}
                    {isRegistering ? "Vytvořit účet" : "Přihlásit do hry"}
                  </button>
                  <div className="text-center">
                    <button 
                      onClick={() => setIsRegistering(!isRegistering)}
                      className="text-[#455a64] hover:text-[#b74b4b] text-sm underline transition"
                    >
                      {isRegistering ? "Už máš účet? Přihlas se." : "Ještě nemáš účet? Zaregistruj se."}
                    </button>
                  </div>
                </div>
              </>
            ) : savedCharacters.length === 0 ? (
              <div className="text-center">
                <p className="text-[#2b4c5e] mb-4 font-bold">Přihlášen jako: {email}</p>
                <button 
                  onClick={() => setGameState("creation")}
                  className="w-full py-3 bg-[#b74b4b] border-2 border-[#b74b4b] text-[#f4f1e1] font-bold rounded hover:bg-[#d46a6a] transition uppercase tracking-widest"
                >
                  Vytvořit první postavu
                </button>
              </div>
            ) : (
              <div className="space-y-2 mt-4">
                <div className="text-center text-[#455a64] font-bold mb-2">Účet: {email}</div>
                <h3 className="text-center text-[#b74b4b] font-bold mb-2 uppercase text-sm tracking-wider">Vyber postavu:</h3>
                {savedCharacters.map((char, idx) => (
                  <button 
                    key={idx}
                    onClick={() => loadGame(char.name)}
                    className="w-full p-3 bg-[#e3dcc8] border border-[#90a4ae] text-left rounded hover:border-[#b74b4b] transition group flex items-center gap-3"
                  >
                    <div className="w-10 h-10 border border-[#b74b4b] rounded overflow-hidden flex-shrink-0 bg-[#2b4c5e]">
                      <img src={`https://image.pollinations.ai/prompt/black%20and%20white%20ink%20drawing%20of%20a%20${encodeURIComponent(char.race)}%20${encodeURIComponent(char.dnd_class)}%20RPG%20character%20portrait?width=128&height=128&nologo=true&seed=42`} alt={char.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                    </div>
                    <div>
                      <div className="font-bold text-[#2b4c5e] group-hover:text-[#b74b4b] transition">{char.name}</div>
                      <div className="text-xs text-[#455a64]">{char.race} {char.dnd_class}</div>
                    </div>
                  
                    <div className="ml-auto flex items-center">
                      <div 
                        onClick={(e) => deleteCharacter(e, char.name)}
                        className="p-2 text-[#90a4ae] hover:text-[#b74b4b] hover:bg-[#f4f1e1] rounded transition"
                        title="Smazat postavu"
                      >
                        <Trash2 size={20} />
                      </div>
                    </div>
</button>
                ))}
              </div>
            )}

            {isLoggedIn && (
              <>
                <div className="relative py-2 mt-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#90a4ae]"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#f4f1e1] px-2 text-[#455a64] text-sm">nebo</span>
                  </div>
                </div>

                <button 
                  onClick={() => setGameState("creation")}
                  className="w-full py-3 bg-[#2b4c5e] text-[#f4f1e1] font-bold rounded hover:bg-[#1e3746] transition uppercase tracking-widest shadow-lg"
                >
                  Založit novou postavu
                </button>
              </>
            )}
          </div>
        <div className="mt-6 text-center">
          <a href="mailto:janmlcak6@gmail.com?subject=Zpětná vazba - Aethelgard" className="text-[#90a4ae] hover:text-[#e3dcc8] transition text-sm flex items-center justify-center gap-2">
            <Mail size={16} /> Máte nápad nebo problém? Napište mi.
          </a>
        </div>
        </div>
      </div>
    );
  }

  if (gameState === "creation") {
    return <CharacterCreation startNewGame={startNewGame} loading={loading}  backstory={backstory} generateBackstory={generateBackstory} />;
  }


  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#1b262c] p-1 md:p-6 gap-2 md:gap-4 font-serif flex flex-col items-center relative">

      
      {/* Patch Notes Modal */}
      {patchNotesOpen && (
        <div className="absolute inset-0 bg-black/80 z-[110] flex items-center justify-center p-4 font-serif">
          <div className="bg-[#f4f1e1] border-2 border-[#b74b4b] rounded max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden bg-[url('/assets/parchment.jpg')] bg-cover">
            <div className="flex justify-between items-center p-4 border-b-2 border-[#b74b4b] bg-[#1b262c]/90">
              <div className="flex items-center gap-2 text-[#d4af37] font-bold text-2xl uppercase tracking-widest font-medieval">
                <ScrollText size={28} /> Kronika Změn (Patchnotes)
              </div>
              <button onClick={() => setPatchNotesOpen(false)} className="text-[#90a4ae] hover:text-[#b74b4b] transition">
                <X size={28} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              {PATCH_NOTES.map((patch: any, idx: number) => (
                <div key={idx} className="bg-[#1b262c]/10 border border-[#90a4ae] rounded p-5 shadow-sm">
                  <div className="flex justify-between items-end border-b border-[#90a4ae] pb-2 mb-4">
                    <h2 className="text-[#b74b4b] font-bold text-xl font-medieval tracking-wide">{patch.version}</h2>
                    <span className="text-[#455a64] text-xs font-bold uppercase">{patch.date}</span>
                  </div>
                  <ul className="space-y-3">
                    {patch.changes.map((change: any, cIdx: number) => (
                      <li key={cIdx} className="text-[#2b4c5e] flex gap-3 text-sm md:text-base leading-relaxed">
                        <span className="shrink-0 text-lg mt-[-2px]">{change.split(' ')[0]}</span>
                        <span>{change.substring(change.indexOf(' ') + 1)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
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

      {/* Player Header */}
      <div className="w-full max-w-7xl bg-[#f4f1e1] border border-[#90a4ae] rounded-lg p-2 md:p-4 shadow-lg flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#b74b4b] rounded-full flex items-center justify-center text-[#f4f1e1] relative">
              <User size={24} />
              <div className="absolute -bottom-2 -right-2 bg-[#d4af37] text-[#1b262c] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-[#f4f1e1]">
                {level}
              </div>
            </div>
            <div>
              <h2 className="font-bold text-xl text-[#2b4c5e] font-medieval">{name}</h2>
              <p className="text-sm text-[#455a64] font-serif">{race} {dndClass}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 text-[#2b4c5e]">
            {/* Status (HP & Food) */}
            <div className="flex items-center gap-4 text-sm sm:text-base mr-0 sm:mr-4">
              <div className="flex items-center gap-1 font-bold text-[#b74b4b]"><Drumstick size={18} /> <span key={`food-${rations}`} className="animate-flash">{rations}</span></div>
              <div className="flex items-center gap-1 font-bold text-[#b74b4b]"><Heart size={18} /> <span>{hp}/100</span></div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap justify-end gap-2 relative">
              <button onClick={() => setStatsOpen(true)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae] relative" title="Vlastnosti postavy">
                <User size={18} />
                {skillPoints > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-bounce">{skillPoints}</span>}
              </button>
              
              <button onClick={() => setSkillsOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae] relative" title="Bojové dovednosti">
                <Sparkles size={18} />
              </button>
              
              <button onClick={() => { setQuestsOpen(true); setUnreadQuests(false); }} className={`relative flex items-center gap-1 font-bold transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border ${unreadQuests ? 'text-[#d4af37] border-[#d4af37] shadow-[0_0_10px_#d4af37]' : 'text-[#2b4c5e] hover:text-[#b74b4b] border-[#90a4ae]'}`} title="Úkoly">
                <BookOpen size={18} />
                {unreadQuests && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-[#f4f1e1] animate-pulse"></span>}
                {!unreadQuests && quests.filter(q => q.stav === 'aktivni').length > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center">{quests.filter(q => q.stav === 'aktivni').length}</span>}
              </button>
              
                                          {worldData && (
                <button onClick={() => setMapOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Mapa světa">
                  <Map size={18} />
                </button>
              )}
              <button onClick={() => setNpcsOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Známé postavy">
                <Users size={18} />
              </button>
              <button onClick={() => setInventoryOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Batoh">
                <Package size={18} />
              </button>

              <button onClick={() => setJournalOpen(true)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae] relative" title="Deník příběhu">
                <ScrollText size={18} />
              </button>
              <button onClick={() => setMusicPlaying(!musicPlaying)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Hudba">
                {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
                          {/* Patch Notes Button */}
            <button onClick={() => setPatchNotesOpen(true)} className="text-[#b74b4b] hover:text-[#d4af37] transition flex items-center gap-1 font-bold bg-[#1b262c] px-2 py-1 rounded border border-[#90a4ae]" title="Novinky ve hře">
              <ScrollText size={20} />
              <span className="hidden sm:inline text-xs uppercase">Novinky</span>
            </button>
            <button onClick={() => setSettingsOpen(true)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Nastavení">
                <Settings2 size={18} />
              </button>

              {/* Mobile Hamburger */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden flex items-center gap-1 font-bold text-[#f4f1e1] hover:text-[#d4af37] transition cursor-pointer bg-[#2b4c5e] px-2 py-1 rounded border border-[#455a64]">
                <Menu size={18} />
              </button>

              {/* Mobile Dropdown */}
              {mobileMenuOpen && (
                <div className="absolute right-0 top-10 w-48 bg-[#f4f1e1] border-2 border-[#90a4ae] rounded shadow-xl p-2 flex flex-col gap-2 z-50 sm:hidden">
                  <button onClick={() => { setStatsOpen(true); setMobileMenuOpen(false); }} className="flex justify-between items-center text-[#2b4c5e] hover:bg-[#e3dcc8] p-2 rounded transition">
                    <span className="font-bold flex items-center gap-2"><User size={18} /> Vlastnosti</span>
                    {skillPoints > 0 && <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-bounce">{skillPoints}</span>}
                  </button>
                  <button onClick={() => { setJournalOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-[#2b4c5e] hover:bg-[#e3dcc8] p-2 rounded transition font-bold text-left">
                    <ScrollText size={18} /> Deník
                  </button>
                  <button onClick={() => { setMusicPlaying(!musicPlaying); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-[#2b4c5e] hover:bg-[#e3dcc8] p-2 rounded transition font-bold text-left">
                    {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />} Hudba
                  </button>
                  <button onClick={() => { setSettingsOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-[#2b4c5e] hover:bg-[#e3dcc8] p-2 rounded transition font-bold text-left">
                    <Settings2 size={18} /> Nastavení
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* XP Bar */}
        <div className="w-full bg-[#e3dcc8] h-2 mt-2 rounded-full overflow-hidden border border-[#90a4ae] relative">
          <div className="h-full bg-gradient-to-r from-[#d4af37] to-[#b59226] transition-all duration-500" style={{width: `${(xp / (level * 100)) * 100}%`}}></div>
        </div>
        <div className="text-right text-[10px] text-[#455a64] -mt-1 font-bold"><span key={`xp-${xp}`} className="animate-flash">{xp}</span> / {level * 300} XP</div>
      </div>

      {/* 2-Column Main Container */}
      <div className="w-full max-w-7xl flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        
        {/* Left Column: Visuals (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col w-1/3 bg-[#1b262c] border-2 border-[#455a64] rounded-lg shadow-lg overflow-hidden relative">
           {/* Region Header */}
           <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/90 via-black/50 to-transparent p-6 z-10 text-center pointer-events-none">
                            {travelMode || travelDaysLeft > 0 ? (
                <div className="flex flex-col items-center">
                   <span className="text-white font-bold text-sm tracking-widest uppercase drop-shadow-md">Putování do:</span>
                   <span className="text-[#d4af37] font-bold text-2xl uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)] font-medieval">{travelDestination}</span>
                   <div className="mt-2 bg-[#1b262c] border border-[#d4af37] px-3 py-1 rounded-full flex gap-2 items-center shadow-lg">
                      <span className="text-white font-bold text-xs uppercase tracking-wider">Cesta:</span>
                      <span className="text-red-400 font-bold animate-pulse">{travelDaysLeft} dní</span>
                   </div>
                </div>
              ) : (
                <span className="text-[#d4af37] font-bold text-2xl uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)] font-medieval">{currentRegion}</span>
              )}
           </div>
           {currentLocationImage ? (
              <div className="w-full h-2/3 border-b-4 border-[#b74b4b] overflow-hidden">
                 <img 
                    src={currentLocationImage} 
                    className="w-full h-full object-cover" 
                    alt="Location" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                 />
              </div>
           ) : (
              <div className="w-full h-2/3 flex flex-col items-center justify-center text-[#455a64] border-b-4 border-[#b74b4b] bg-[#0f1619]">
                <span className="text-xl font-medieval tracking-widest">Neznámé končiny</span>
              </div>
           )}
           <div className="p-6 flex-1 overflow-y-auto bg-[#1e3746] text-[#e3dcc8] text-sm leading-relaxed border-t border-[#b74b4b]/30 shadow-inner">
              {inCombat ? (
                <div className="flex flex-col gap-4">
                  <div className="text-[#b74b4b] font-bold font-medieval text-2xl mb-2 uppercase tracking-wider border-b border-[#b74b4b]/50 pb-2 flex justify-center items-center gap-2">
                    <Skull size={24} /> Boj
                  </div>
                  {enemies.map((enemy, idx) => (
                    <div key={idx} className="flex flex-col gap-1 bg-[#1b262c] p-3 rounded-lg border-2 border-[#b74b4b]/50 shadow-md">
                      <div className="text-[#f4f1e1] font-bold text-lg flex justify-between">
                        <span>{enemy.jmeno}</span>
                        <span className="text-red-400">{enemy.hp}/{enemy.max_hp}</span>
                      </div>
                      <div className="w-full bg-[#0f1619] h-3 rounded-full overflow-hidden border border-[#455a64] mt-1 mb-1">
                        <div className="h-full bg-red-600 transition-all duration-300" style={{width: `${(enemy.hp / enemy.max_hp) * 100}%`}}></div>
                      </div>
                      <div className="text-[#90a4ae] text-sm italic text-center">{enemy.status}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="text-[#d4af37] font-bold font-medieval text-2xl mb-4 uppercase tracking-wider border-b border-[#455a64] pb-2 text-center">Místo</div>
                  <div className="italic font-serif text-lg">
                    {currentLocationDesc || "Nevidíš nic zvláštního..."}
                  </div>
                </>
              )}
           </div>
        </div>

        {/* Right Column: Chat and Actions */}
        <div className="flex-1 flex flex-col overflow-hidden rounded-lg shadow-lg border border-[#90a4ae] relative">

      {/* Main Game Log */}
      <div className="w-full max-w-4xl mx-auto bg-[#f4f1e1] flex-1 overflow-y-auto p-3 md:p-8 border-x border-[#90a4ae] shadow-lg flex flex-col gap-4 md:gap-6" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')" }}>
        
        {history.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.type === "player" ? "items-end" : "items-start"}`}>
            
            {msg.type === "system" && (
              <div className="w-full text-center italic text-[#b74b4b] text-sm my-4 border-b border-[#90a4ae] pb-2">
                — {msg.text} —
              </div>
            )}

            {msg.type === "player" && (
              <div className="flex gap-4 items-end self-end max-w-[90%]">
                <div className="bg-[#2b4c5e] text-[#f4f1e1] px-4 py-2 rounded-lg shadow-md flex-1">
                  <span className="opacity-50 text-xs uppercase block mb-1">Tvá akce</span>
                  {msg.text}
                </div>
                <div className="w-16 h-16 border-2 border-[#b74b4b] rounded overflow-hidden shadow-lg bg-[#e3dcc8] flex-shrink-0">
                  <img src={`https://image.pollinations.ai/prompt/black%20and%20white%20ink%20drawing%20of%20a%20${encodeURIComponent(race)}%20${encodeURIComponent(dndClass)}%20RPG%20character%20portrait?width=256&height=256&nologo=true&seed=42`} alt="Player" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {msg.type === "dm" && (
              <div className="flex flex-col gap-3 w-full max-w-[90%]">
                {/* Obrázek lokace (Zelený rámeček na náčrtu uživatele) */}
                {msg.image_prompt && (
                  <div className="lg:hidden w-full h-56 border-4 border-[#2b4c5e] rounded shadow-lg overflow-hidden mb-2">
                    <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(msg.image_prompt)}?width=768&height=432&nologo=true&seed=42`} alt="Location" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Popis prostředí (Kurzíva) */}
                {msg.popis_okoli && (
                  <div className="lg:hidden italic text-[#455a64] leading-relaxed text-lg border-l-4 border-[#90a4ae] pl-4">
                    {msg.popis_okoli}
                  </div>
                )}
                
                {/* Přímý výsledek akce */}
                {msg.vypravec && (
                  <div className="text-[#1b262c] font-medium leading-relaxed group relative">
                    <button 
                      onClick={() => playAudio(msg.vypravec, "narrator")} 
                      className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition text-[#b74b4b]"
                      title="Přehrát hlas vypravěče"
                    >
                      <Volume2 size={20} />
                    </button>
                    {msg.vypravec}
                  </div>
                )}

                {/* System Log (Herní mechaniky – hody, XP, poškození) */}
                {msg.system_log && (
                  <div className="mt-2 bg-[#e3dcc8] border-2 border-[#90a4ae] rounded-md px-4 py-3 font-mono text-sm text-[#2b4c5e] leading-relaxed shadow-sm">
                    <div className="text-[#b74b4b] font-bold uppercase tracking-widest text-[11px] mb-2 flex items-center gap-1 border-b border-[#90a4ae] pb-1">
                      <span>⚙</span> Herní mechaniky
                    </div>
                    <FormattedSystemLog text={msg.system_log} />
                  </div>
                )}

                {/* Zpětná kompatibilita pro staré uložení (jedno NPC) */}
                {msg.npc_mluvi?.aktivni && (
                  <div className="bg-[#e3dcc8] p-4 rounded-lg shadow-sm border border-[#90a4ae] mt-2 relative group">
                    <button onClick={() => playAudio(msg.npc_mluvi.text, msg.npc_mluvi.pohlavi === "zena" ? "npc_zena" : "npc_muz")} className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition text-[#b74b4b]"><Volume2 size={20} /></button>
                    <div className="absolute w-3 h-3 bg-[#e3dcc8] border-l border-t border-[#90a4ae] -top-[7px] left-8 transform rotate-45"></div>
                    <span className="font-bold text-[#b74b4b] block mb-1">{msg.npc_mluvi.jmeno || "Neznámý"}:</span>
                    <span className="text-[#2b4c5e]">"<TypewriterText text={msg.npc_mluvi.text} animate={i === history.length - 1} />"</span>
                  </div>
                )}

                {/* Nový seznam NPC dialogů s portréty (Žlutý rámeček na náčrtu uživatele) */}
                {msg.npc_dialogy && msg.npc_dialogy.length > 0 && msg.npc_dialogy.map((npc: any, nIdx: number) => {
                  let seed = 42;
                  if (npc.jmeno) {
                    let h = 0;
                    for(let i=0; i<npc.jmeno.length; i++) h = Math.imul(31, h) + npc.jmeno.charCodeAt(i) | 0;
                    seed = Math.abs(h);
                  }
                  
                  const isPlayer = name && npc.jmeno && npc.jmeno.toLowerCase() === name.toLowerCase();

                  if (isPlayer) {
                    return (
                      <div key={nIdx} className="flex gap-4 items-start self-end w-full mt-2 flex-row-reverse max-w-[90%]">
                        <div className="w-16 h-16 border-2 border-[#b74b4b] rounded overflow-hidden shadow-sm bg-[#e3dcc8] flex-shrink-0 mt-2">
                          <img src={`https://image.pollinations.ai/prompt/black%20and%20white%20ink%20drawing%20of%20a%20${encodeURIComponent(race)}%20${encodeURIComponent(dndClass)}%20RPG%20character%20portrait?width=256&height=256&nologo=true&seed=42`} alt={npc.jmeno} className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-[#2b4c5e] text-[#f4f1e1] p-4 rounded-lg shadow-md relative group flex-1">
                          <button onClick={() => playAudio(npc.text, 'narrator')} className="absolute left-4 top-4 opacity-0 group-hover:opacity-100 transition text-[#e3dcc8] hover:text-white"><Volume2 size={20} /></button>
                          <div className="absolute w-3 h-3 bg-[#2b4c5e] top-6 -right-[6px] transform rotate-45"></div>
                          <span className="font-bold text-[#e3dcc8] block mb-1">{npc.jmeno}:</span>
                          <span className="opacity-90">"<TypewriterText text={npc.text} animate={i === history.length - 1} />"</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={nIdx} className="flex gap-4 items-start w-full mt-2">
                      <div className="w-16 h-16 border-2 border-[#90a4ae] rounded overflow-hidden shadow-sm bg-[#e3dcc8] flex-shrink-0 mt-2">
                        <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent('black and white ink drawing portrait sketch of ' + (npc.image_prompt || npc.jmeno))}?width=256&height=256&nologo=true&seed=${seed}`} alt={npc.jmeno} className="w-full h-full object-cover" />
                      </div>
                      <div className="bg-[#e3dcc8] p-4 rounded-lg shadow-sm border border-[#90a4ae] relative group flex-1">
                        <button onClick={() => playAudio(npc.text, npc.pohlavi === 'muz' ? 'npc_muz' : 'npc_zena')} className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition text-[#b74b4b]"><Volume2 size={20} /></button>
                        <div className="absolute w-3 h-3 bg-[#e3dcc8] border-b border-l border-[#90a4ae] top-6 -left-[7px] transform rotate-45"></div>
                        <span className="font-bold text-[#b74b4b] block mb-1">{npc.jmeno || "Neznámá"}:</span>
                        <span className="text-[#2b4c5e]">"<TypewriterText text={npc.text} animate={i === history.length - 1} />"</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {msg.type === "error" && (
              <div className="bg-red-100 text-red-800 p-3 rounded text-sm w-full font-sans">
                ⚠️ {msg.text}
              </div>
            )}
            
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-[#455a64] italic">
            <span className="animate-pulse">Pán jeskyně přemýšlí...</span>
          </div>
        )}
        
            {loading && (
              <div className="flex gap-4 animate-fade-in-up">
                <div className="w-12 h-12 flex-shrink-0 border-2 border-[#90a4ae] bg-[#2b4c5e] rounded-lg flex items-center justify-center font-bold text-[#90a4ae] text-xl font-medieval">
                  DM
                </div>
                <div className="bg-[#e3dcc8] border-2 border-[#90a4ae] p-4 rounded-lg flex items-center gap-2 text-[#455a64] italic">
                  <span>Pán jeskyně přemýšlí</span>
                  <span className="flex gap-1">
                    <span className="thinking-dot">.</span>
                    <span className="thinking-dot">.</span>
                    <span className="thinking-dot">.</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />

      </div>

      {/* Action Area (Footer of Right Column) */}
      <div className="w-full bg-[#1e3746] border-t-4 border-[#b74b4b] p-3 md:p-5 flex flex-col gap-3 md:gap-5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-10 shrink-0">

        {/* Suggested Actions or Combat Quick Actions */}
        {!loading && (
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setActionsOpen(!actionsOpen)} 
              className="md:hidden w-full bg-[#2b4c5e] border border-[#90a4ae] text-[#f4f1e1] px-4 py-2 rounded-sm text-sm hover:bg-[#455a64] transition-all font-bold flex justify-center items-center gap-2 shadow-md"
            >
              Vyrolovat akce {actionsOpen ? "▲" : "▼"}
            </button>
            <div className={`${actionsOpen ? 'flex' : 'hidden'} md:flex flex-wrap gap-2`}>
            {inCombat ? (
              <>
                <button onClick={() => sendAction(`Útočím zbraní: ${inventory.find(i => i.id === equipped["hlavní ruka"])?.name || "Pěsti"}`)} className="bg-[#b74b4b] border border-[#b74b4b] text-[#f4f1e1] px-4 py-2 rounded-sm text-sm hover:bg-[#8a3333] transition-all shadow-md font-bold flex items-center gap-1 font-serif">
                  <Sword size={16} /> Útok zbraní
                </button>
                <button onClick={() => setSkillsOpen(true)} className="bg-[#1b262c] border border-[#90a4ae] text-[#90a4ae] px-4 py-2 rounded-sm text-sm hover:bg-[#90a4ae] hover:text-[#1b262c] transition-all shadow-md font-bold flex items-center gap-1 font-serif">
                  <Sparkles size={16} /> Použít dovednost
                </button>
                                            {worldData && (
                <button onClick={() => setMapOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Mapa světa">
                  <Map size={18} />
                </button>
              )}
              <button onClick={() => setNpcsOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Známé postavy">
                <Users size={18} />
              </button>
              <button onClick={() => setInventoryOpen(true)} className="bg-[#1b262c] border border-[#90a4ae] text-[#90a4ae] px-4 py-2 rounded-sm text-sm hover:bg-[#90a4ae] hover:text-[#1b262c] transition-all shadow-md font-bold flex items-center gap-1 font-serif">
                  <Package size={16} /> Batoh
                </button>
                <button onClick={() => sendAction("Pokusím se z boje utéct!")} className="bg-[#1b262c] border border-[#455a64] text-[#78909c] px-4 py-2 rounded-sm text-sm hover:bg-[#2b4c5e] hover:text-[#f4f1e1] transition-all shadow-md italic font-serif">
                  Útěk
                </button>
              </>
            ) : (
              <>
                {/* Points of Interest (City Locations) */}
                {locationType === 'mesto' && pointsOfInterest.map((poi, i) => (
                  <button 
                    key={`poi-${i}`} 
                    onClick={() => sendAction(`Jdu prozkoumat: ${poi.nazev}`)}
                    className="bg-[#d4af37] text-[#1b262c] font-bold px-4 py-2 rounded-sm text-sm hover:bg-[#f4f1e1] transition-all shadow-md border border-[#d4af37] font-serif flex items-center gap-1"
                  >
                    <MapPin size={16} className="opacity-70" /> {poi.nazev}
                  </button>
                ))}
                
                {/* Regular Suggested Actions */}
                {suggestedActions.map((act, i) => (
                  <button 
                    key={`act-${i}`} 
                    onClick={() => sendAction(act)}
                    className="bg-[#1b262c] border border-[#90a4ae] text-[#e3dcc8] px-4 py-2 rounded-sm text-sm hover:bg-[#90a4ae] hover:text-[#1b262c] transition-all shadow-md font-serif"
                  >
                    {act}
                  </button>
                ))}
              </>
            )}
          </div>
          </div>
        )}

        {/* Custom Action Input */}
                    <div className="flex gap-2 relative">
              <button
                onClick={() => setIsOOC(!isOOC)}
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition ${isOOC ? 'text-[#b74b4b]' : 'text-[#455a64] hover:text-[#90a4ae]'}`}
                title="Vnitřní myšlenka (OOC) - zastaví čas a herní události"
              >
                <Brain size={24} />
              </button>
              <input 
                type="text" 
                value={customAction}
                onChange={(e) => setCustomAction(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendAction(customAction)}
                placeholder={isOOC ? "Tvá vnitřní myšlenka... (čas stojí)" : "Kam povedou tvé kroky přírodou?"} 
                className={`flex-1 ${isOOC ? 'bg-[#1e2a3b] text-[#a4c2f4] italic border-[#b74b4b]' : 'bg-[#1b262c] text-[#f4f1e1] border-[#455a64]'} pl-12 pr-3 py-3 rounded-lg border focus:outline-none focus:border-[#d4af37] placeholder-[#90a4ae] transition-colors`}
                disabled={loading}
              />
              <button 
                onClick={() => sendAction(customAction)}
                className="bg-[#b74b4b] hover:bg-[#8c3a3a] text-[#f4f1e1] px-6 py-3 rounded-lg font-bold transition disabled:opacity-50 flex items-center justify-center border-b-4 border-black/30"
                disabled={loading || !customAction.trim()}
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
            </div>
      </div>
      {/* End Right Column */}
      </div>
      {/* End 2-Column Container */}
      </div>

      {/* Stats Modal */}
      {statsOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
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
      {skillsOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl bg-[#2b4c5e] rounded-lg border-4 border-[#90a4ae] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#e3dcc8] p-4 flex justify-between items-center border-b-4 border-[#90a4ae]">
              <div className="flex items-center gap-2 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest">
                <Sparkles size={28} /> Dovednosti
              </div>
              <button onClick={() => setSkillsOpen(false)} className="text-[#2b4c5e] hover:text-[#b74b4b] transition">
                <X size={28} />
              </button>
            </div>
            
            <div className="p-6 bg-[#1e3746] flex flex-col gap-6 overflow-y-auto">
              <div className="flex justify-between items-center bg-[#1b262c] border-2 border-[#455a64] p-4 rounded text-[#90a4ae]">
                <div>
                  <h3 className="font-bold text-lg text-[#f4f1e1]">Tvé schopnosti</h3>
                  <p className="text-sm">Zde najdeš odemčené bojové dovednosti.</p>
                </div>
                <div className="text-right">
                  <div className="text-sm">Nevyužité body dovedností</div>
                  <div className="text-2xl font-bold text-[#d4af37]">{skillPoints}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {id: "silny_uder", name: "Silný úder", desc: "Základní útok nablízko se zvýšeným poškozením (Aktivní)"},
                  {id: "ohniva_koule", name: "Ohnivá koule", desc: "Sešle zničující ohnivou kouli na cíl (Aktivní - Magie)"},
                  {id: "plizeni", name: "Stínový krok", desc: "Postava se přesune do stínů a získá výhodu na další útok (Aktivní)"},
                  {id: "lecive_slovo", name: "Léčivé slovo", desc: "Magicky obnoví trochu zdraví (Aktivní)"},
                  {id: "odolnost", name: "Železná kůže", desc: "V boji tě je těžší zranit. (Pasivní)"},
                  {id: "sermir", name: "Mistr meče", desc: "Vyšší šance na kritický zásah. (Pasivní)"}
                ].map(skill => {
                  const isUnlocked = skills.find(s => s.id === skill.id);
                  return (
                    <div key={skill.id} className={`p-4 border-2 rounded ${isUnlocked ? 'bg-[#2b4c5e] border-[#90a4ae]' : 'bg-[#1b262c] border-[#455a64] opacity-80'}`}>
                      <h4 className={`font-bold ${isUnlocked ? 'text-[#f4f1e1]' : 'text-[#78909c]'}`}>{skill.name}</h4>
                      <p className="text-sm text-[#90a4ae] mt-1 mb-3">{skill.desc}</p>
                      
                      {isUnlocked ? (
                        skill.desc.includes("Aktivní") ? (
                          <button 
                            onClick={() => {
                                setCustomAction(`Používám dovednost: ${skill.name}`);
                                setSkillsOpen(false);
                            }}
                            className="bg-[#b74b4b] text-[#f4f1e1] px-3 py-1 rounded text-sm hover:bg-[#8a3333] transition w-full font-bold"
                          >
                            Připravit do akce
                          </button>
                        ) : (
                          <div className="text-[#d4af37] text-sm font-bold text-center italic">Aktivní stále</div>
                        )
                      ) : (
                        <button 
                          onClick={() => {
                            if (skillPoints > 0) {
                              setSkillPoints(p => p - 1);
                              setSkills([...skills, skill]);
                            }
                          }}
                          disabled={skillPoints <= 0}
                          className="bg-[#1e3746] text-[#90a4ae] border border-[#455a64] px-3 py-1 rounded text-sm hover:bg-[#2b4c5e] transition w-full disabled:opacity-50"
                        >
                          Odemknout (1 bod)
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      )}

      {/* Quests Modal */}
        <QuestsModal isOpen={questsOpen} onClose={() => setQuestsOpen(false)} />

      
        
        {/* Map Modal */}
        <MapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} setSelectedItem={setSelectedItem} />

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
           <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center bg-black/70 px-12 py-6 border-y-4 border-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.4)] backdrop-blur-sm">
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
