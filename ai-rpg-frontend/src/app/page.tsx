"use client";

import { useState, useRef, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

import ReactPlayer from 'react-player';
import { Send, Heart, Package, Sword, Shield, FlaskConical, Gem, Shirt, ScrollText, X, Volume2, VolumeX, User, Users, Settings2, Map, Sparkles, Skull, BookOpen, MapPin, Drumstick, Mail, Loader2, Trash2 , Brain , Menu } from "lucide-react";

const getStringHash = (str: string) => {
  let h = 0;
  for(let i=0; i<str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return Math.abs(h);
};

const ItemIcon = ({ iconName, itemId = "", className = "", size = 40 }: { iconName: string, itemId?: string, className?: string, size?: number }) => {
  const hash = getStringHash(itemId || iconName);
  let imgPath = "";

  switch(iconName) {
    case 'Sword':
      // Máme 5 klasických mečů v FreeFantasyStockArtV3
      imgPath = `/items/FreeFantasyStockArtV3/sword_free${(hash % 5) + 1}.png`;
      break;
    case 'Shield':
      // 4 štíty
      imgPath = `/items/FreeFantasyStockArtV3/shield_free${(hash % 4) + 1}.png`;
      break;
    case 'Potion':
      // 50 lektvarů v Complete Package
      imgPath = `/items/Complete Package v1.2/Complete Package v1.2/Transparent/potion${(hash % 50) + 1}.png`;
      break;
    case 'Ring':
      // 5 krystalů jako prsteny
      imgPath = `/items/Complete Package v1.2/Complete Package v1.2/Transparent/crystal${(hash % 5) + 1}.png`;
      break;
    case 'Shirt':
      // Využijeme válečné zástavy jako pláště/zbroje (jsou 3)
      imgPath = `/items/FreeFantasyStockArtV3/war_banner_free${(hash % 3) + 1}.png`;
      break;
    case 'Scroll':
      // 10 svitků v Complete Package
      imgPath = `/items/Complete Package v1.2/Complete Package v1.2/Transparent/scroll${(hash % 10) + 1}.png`;
      break;
    default:
      // Defaultní dýka
      imgPath = `/items/FreeFantasyStockArtV3/dagger_free${(hash % 6) + 1}.png`;
  }

  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <img 
        src={imgPath} 
        alt={iconName} 
        className="max-w-full max-h-full object-contain filter drop-shadow-md"
      />
    </div>
  );
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

  const [gameState, setGameState] = useState<"menu" | "creation" | "playing">("menu");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Character Creation Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [dndClass, setDndClass] = useState("Bojovník");
  const [gameMode, setGameMode] = useState("sandbox");
  const [race, setRace] = useState("Člověk");
  const [stats, setStats] = useState({ str: 15, dex: 14, con: 13, intel: 12, wis: 10, cha: 8 });
  const [keywords, setKeywords] = useState("");
  const [backstory, setBackstory] = useState<{appearance: string, personality: string, backstory: string} | null>(null);
  
  // Game Play State
  const [savedCharacters, setSavedCharacters] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const [customAction, setCustomAction] = useState("");
  const [loading, setLoading] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [isOOC, setIsOOC] = useState(false);
  const [journal, setJournal] = useState<string[]>([]);
  const [hp, setHp] = useState(100);
  const [inventory, setInventory] = useState<any[]>([]);
  const [equipped, setEquipped] = useState<any>({
    "hlava": null,
    "hruď": null,
    "hlavní ruka": null,
    "druhá ruka": null,
    "prsten": null,
    "krk": null
  });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bgVolume, setBgVolume] = useState(0.2);
  const [currentTrack, setCurrentTrack] = useState("/ambient.mp3");
  const [ttsVolume, setTtsVolume] = useState(1.0);
  
  // Nové stavy pro boj a RPG systém
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [skillPoints, setSkillPoints] = useState(0);
  const [gold, setGold] = useState(15);
  const [rations, setRations] = useState(3);
  const [currentSpellSlots, setCurrentSpellSlots] = useState(0);
  const [maxSpellSlots, setMaxSpellSlots] = useState(0);
  const [skills, setSkills] = useState<{id: string, name: string, desc: string}[]>([]);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [inCombat, setInCombat] = useState(false);
  const [enemies, setEnemies] = useState<{jmeno: string, hp: number, max_hp: number, status: string}[]>([]);
  
  // Quests
  const [quests, setQuests] = useState<{id: string, nazev: string, popis: string, stav: string}[]>([]);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [questsOpen, setQuestsOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [currentLocationImage, setCurrentLocationImage] = useState<string | null>(null);
  const [currentLocationDesc, setCurrentLocationDesc] = useState<string>("");
  const [locationType, setLocationType] = useState<string>("divocina");
  const [currentRegion, setCurrentRegion] = useState<string>("Neznámé končiny");
  const [travelMode, setTravelMode] = useState(false);
  const [travelDaysLeft, setTravelDaysLeft] = useState(0);
  const [travelDestination, setTravelDestination] = useState("");
  const [npcs, setNpcs] = useState<any[]>([]);
  const [npcsOpen, setNpcsOpen] = useState(false);
  const [worldData, setWorldData] = useState<any>(null);
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

        setTravelMode(state.travel_mode || false);
        setTravelDaysLeft(state.travel_days_left || 0);
        setTravelDestination(state.travel_destination || "");
        setNpcs(state.zname_postavy || []);
        setWorldData(state.world_data || null);

        
        const state = data.state || {};
        setHp(state.hp || 100);
        setXp(state.xp || 0);
        setLevel(state.level || 1);
        setSkillPoints(state.skillPoints || 0);
        setInventory(state.inventory || []);
        setEquipped(state.equipped || {});
        setSkills(state.skills || []);
        setAvailableSkills(state.available_skills || []);
        setJournal(state.journal || []);
        
        // AUTO-PLAY intro
        playAudioSequentially([{text: data.intro_text, type: "narrator"}]);

      } else {
        setHistory([{ type: "error", text: typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail) }]);
      }
    } catch (err) {
      setHistory([{ type: "error", text: "Chyba připojení k serveru." }]);
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
    return (
      <div className="min-h-screen bg-[#1b262c] p-4 font-serif text-[#2b4c5e] overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-[#f4f1e1] rounded p-6 sm:p-10 shadow-2xl border border-[#90a4ae] my-8">
          <h2 className="text-3xl font-bold border-b-2 border-[#b74b4b] pb-4 mb-6 font-medieval">Tvorba Hrdiny</h2>
          
          <div className="space-y-6">
            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-bold mb-2">Jméno hrdiny</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-[#e3dcc8] border border-[#90a4ae] rounded outline-none" placeholder="Tvé jméno..." />
              </div>
              
              <div>
                <label className="block font-bold mb-2">Rasa</label>
                <select value={race} onChange={e => setRace(e.target.value)} className="w-full p-2 bg-[#e3dcc8] border border-[#90a4ae] rounded outline-none">
                  {races.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-2">Povolání</label>
                <select value={dndClass} onChange={e => setDndClass(e.target.value)} className="w-full p-2 bg-[#e3dcc8] border border-[#90a4ae] rounded outline-none">
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-[#e3dcc8] p-4 rounded border border-[#90a4ae]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold flex items-center gap-2"><Settings2 size={18} /> Statistiky (Standard Array)</h3>
                <span className="text-xs text-[#455a64] italic">Automaticky optimalizováno pro {dndClass}</span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                {Object.entries(stats).map(([stat, val]) => (
                  <div key={stat} className="bg-[#f4f1e1] p-2 rounded border border-[#90a4ae]">
                    <div className="text-xs uppercase text-[#455a64] font-bold">{stat}</div>
                    <div className="text-xl font-bold text-[#b74b4b]">{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Backstory Generator */}
            <div className="bg-[#e3dcc8] p-4 rounded border border-[#90a4ae]">
               <h3 className="font-bold flex items-center gap-2 mb-2"><Sparkles size={18} className="text-[#b74b4b]" /> Příběh a charakter</h3>
               <p className="text-sm text-[#455a64] mb-3">Napiš pár slov o tom, jaký tvůj hrdina je (např. "zjizvený, hrubý, hledá pomstu za smrt bratra") a nech AI dopsat zbytek.</p>
               <textarea 
                  value={keywords} 
                  onChange={e => setKeywords(e.target.value)}
                  className="w-full p-2 bg-[#f4f1e1] border border-[#90a4ae] rounded outline-none h-20 mb-3"
                  placeholder="Klíčová slova..."
               />
               <button onClick={generateBackstory} disabled={loading} className="w-full py-2 bg-[#2b4c5e] text-[#f4f1e1] font-bold rounded hover:bg-[#b74b4b] transition shadow disabled:opacity-50">
                 {loading ? "Přemýšlím..." : "Vygenerovat kompletní profil"}
               </button>

               {backstory && (
                 <div className="mt-4 p-4 bg-[#f4f1e1] border-l-4 border-[#b74b4b] space-y-3 text-sm">
                   <p><strong>Vzhled:</strong> {backstory.appearance}</p>
                   <p><strong>Chování:</strong> {backstory.personality}</p>
                   <p><strong>Historie:</strong> {backstory.backstory}</p>
                 </div>
               )}
            </div>

            <button onClick={startNewGame} disabled={loading} className="w-full py-4 bg-[#b74b4b] text-[#f4f1e1] font-bold text-xl rounded hover:bg-[#8a3333] transition shadow-lg disabled:opacity-50">
              {loading ? "Vstupuji do portálu..." : "Začít dobrodružství"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#1b262c] p-1 md:p-6 gap-2 md:gap-4 font-serif flex flex-col items-center relative">

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
      {journalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-[#2b4c5e] rounded-lg border-4 border-[#90a4ae] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-[#e3dcc8] p-4 flex justify-between items-center border-b-4 border-[#90a4ae]">
              <div className="flex items-center gap-2 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest">
                <ScrollText size={28} /> Deník postavy
              </div>
              <button onClick={() => setJournalOpen(false)} className="text-[#2b4c5e] hover:text-[#b74b4b] transition">
                <X size={28} />
              </button>
            </div>
            <div className="p-6 bg-[#1e3746] overflow-y-auto">
              <div className="mb-6 pb-4 border-b border-[#455a64]">
                <h3 className="text-[#d4af37] font-bold text-xl mb-2 font-medieval">Identita</h3>
                <p className="text-[#f4f1e1] italic text-lg">Jméno: {name} | Rasa: {race} | Třída: {dndClass}</p>
              </div>
              <h3 className="text-[#d4af37] font-bold text-xl mb-4 font-medieval">Příběh a vývoj událostí</h3>
              <div className="flex flex-col gap-4">
                {journal.map((entry, i) => (
                  <div key={i} className="bg-[#1b262c] p-4 rounded-lg border border-[#455a64] text-[#90a4ae] italic shadow-inner">
                    <div className="text-xs text-[#b74b4b] font-bold uppercase mb-1">Kapitola {i + 1}</div>
                    {entry}
                  </div>
                ))}
                {journal.length === 0 && <div className="text-center text-[#90a4ae] italic">Tvůj příběh se teprve začíná psát...</div>}
              </div>
            </div>
          </div>
        </div>
      )}

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
      {questsOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-[#2b4c5e] rounded-lg border-4 border-[#90a4ae] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#e3dcc8] p-4 flex justify-between items-center border-b-4 border-[#90a4ae]">
              <div className="flex items-center gap-2 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest">
                <BookOpen size={28} /> Deník úkolů
              </div>
              <button onClick={() => setQuestsOpen(false)} className="text-[#2b4c5e] hover:text-[#b74b4b] transition">
                <X size={28} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[url('/assets/parchment.jpg')] bg-cover bg-center">
              {quests.length === 0 ? (
                <div className="text-center text-[#455a64] font-bold mt-10">Zatím nemáš žádné úkoly.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {quests.map(quest => (
                    <div key={quest.id} className={`p-4 border-2 rounded ${quest.stav === 'splneno' ? 'bg-[#2a3f2a]/90 border-[#4a7f4a] text-[#d4af37]' : quest.stav === 'selhani' ? 'bg-[#3f2a2a]/90 border-[#b74b4b] text-[#78909c]' : 'bg-[#1b262c]/90 border-[#90a4ae] text-[#f4f1e1]'}`}>
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="font-bold text-xl">{quest.nazev}</h3>
                         <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${quest.stav === 'splneno' ? 'bg-[#4a7f4a] text-white' : quest.stav === 'selhani' ? 'bg-[#b74b4b] text-white' : 'bg-[#d4af37] text-black'}`}>
                            {quest.stav === 'splneno' ? 'Splněno' : quest.stav === 'selhani' ? 'Selhání' : 'Aktivní'}
                         </span>
                      </div>
                      <p className={quest.stav === 'aktivni' ? 'text-[#90a4ae]' : 'text-opacity-80'}>{quest.popis}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      
        
        {/* Map Modal */}
        {mapOpen && worldData && (
          <div className="absolute inset-0 bg-black/80 z-[100] flex items-center justify-center p-2 md:p-8">
            <div className="bg-[#e3dcc8] w-full h-full max-h-screen max-w-6xl rounded shadow-2xl relative overflow-hidden border-4 border-[#1b262c] bg-[url('/assets/parchment.jpg')] bg-cover">
              
              <div className="absolute top-4 left-4 z-50 bg-[#f4f1e1]/90 px-4 py-2 rounded border border-[#90a4ae] shadow-lg pointer-events-none">
                <h2 className="text-[#b74b4b] font-bold text-xl uppercase font-medieval tracking-widest drop-shadow">Světová mapa</h2>
              </div>

              <button onClick={() => setMapOpen(false)} className="absolute top-4 right-4 bg-[#1b262c] text-[#f4f1e1] p-2 rounded hover:bg-[#b74b4b] transition z-50 border border-[#90a4ae]">
                <X size={24} />
              </button>

              <div className="relative w-full h-full min-h-[600px] p-10">
                {/* Roads/Routes (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {worldData.locations?.map((loc: any, i: number) => {
                    return worldData.locations?.map((loc2: any, j: number) => {
                      if (i < j) {
                        const dx = loc.x - loc2.x;
                        const dy = loc.y - loc2.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        if (dist < 40) { // Connect nodes closer than 40 units
                          return <line key={`${i}-${j}`} x1={`${loc.x}%`} y1={`${loc.y}%`} x2={`${loc2.x}%`} y2={`${loc2.y}%`} stroke="#455a64" strokeWidth="2" strokeDasharray="4,6" opacity={0.6} />
                        }
                      }
                      return null;
                    });
                  })}
                </svg>

                {/* Location Nodes */}
                {worldData.locations?.map((loc: any, idx: number) => {
                  const isCurrent = currentRegion?.toLowerCase().includes(loc.nazev?.toLowerCase()) || false;
                  return (
                    <div key={idx} className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20" style={{left: `${loc.x}%`, top: `${loc.y}%`}}>
                      <div className={`w-4 h-4 md:w-6 md:h-6 rounded-full border-2 ${isCurrent ? 'bg-[#b74b4b] border-[#d4af37] shadow-[0_0_15px_#b74b4b] animate-pulse' : 'bg-[#1b262c] border-[#90a4ae]'} transition-transform duration-300 group-hover:scale-150 z-10`} />
                      <span className="mt-1 text-xs md:text-sm font-bold text-[#1b262c] drop-shadow-[0_1px_1px_rgba(255,255,255,1)] font-medieval whitespace-nowrap bg-[#f4f1e1]/70 px-1 rounded transition-opacity">
                        {loc.nazev}
                      </span>
                      <div className="hidden group-hover:block absolute top-full mt-2 w-48 md:w-64 bg-[#1b262c] text-[#f4f1e1] text-xs p-3 rounded z-30 shadow-xl border-2 border-[#b74b4b] text-left">
                        <span className="font-bold text-[#d4af37] block mb-2 uppercase border-b border-[#455a64] pb-1">{String(loc.typ).replace('_', ' ')}</span>
                        <p className="italic font-serif">{loc.popis}</p>
                        {isCurrent && <p className="mt-2 text-green-400 font-bold uppercase text-[10px]">📍 Tvá současná poloha</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* NPCs Modal */}
        {npcsOpen && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#f4f1e1] border-2 border-[#b74b4b] rounded max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-[#90a4ae] bg-[#e3dcc8]">
                <div className="flex items-center gap-2 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest font-medieval">
                  <Users size={28} /> Deník postav
                </div>
                              {worldData && (
                <button onClick={() => setMapOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Mapa světa">
                  <Map size={18} />
                </button>
              )}
              <button onClick={() => setNpcsOpen(false)} className="text-[#2b4c5e] hover:text-[#b74b4b] transition">
                  <X size={28} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[url('/assets/parchment.jpg')] bg-cover bg-center">
                {npcs.length === 0 ? (
                  <div className="text-center text-[#455a64] py-8 italic font-serif">Zatím jsi nepotkal nikoho důležitého...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {npcs.map((npc, idx) => (
                      <div key={idx} className="bg-[#1b262c]/80 border border-[#90a4ae] rounded p-4 flex flex-col gap-2 relative">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-[#d4af37] font-bold font-medieval text-lg uppercase">{npc.jmeno}</h3>
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border font-bold ${npc.vztah.toLowerCase().includes('přát') ? 'bg-green-900/50 text-green-400 border-green-500' : npc.vztah.toLowerCase().includes('nepř') ? 'bg-red-900/50 text-red-400 border-red-500' : 'bg-yellow-900/50 text-yellow-400 border-yellow-500'}`}>
                            {npc.vztah}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#90a4ae] text-xs">
                          <MapPin size={12} /> {npc.lokace}
                        </div>
                        <p className="text-[#f4f1e1] text-sm font-serif italic mt-2">{npc.popis}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Inventory Modal */}
      {inventoryOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-5xl bg-[#2b4c5e] rounded-lg border-4 border-[#90a4ae] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#e3dcc8] p-4 flex justify-between items-center border-b-4 border-[#90a4ae]">
              <div className="flex items-center gap-2 text-[#b74b4b] font-bold text-2xl uppercase tracking-widest">
                <Package size={28} /> Inventář
              </div>
              <button onClick={() => setInventoryOpen(false)} className="text-[#2b4c5e] hover:text-[#b74b4b] transition">
                <X size={28} />
              </button>
            </div>

            {/* Modal Body - 3 Columns */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#1e3746] flex flex-col md:flex-row gap-6">
              
              {/* Column 1: Equipment & Stats */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-[#2b4c5e] border-2 border-[#455a64] p-4 rounded flex flex-col items-center gap-4">
                  <h3 className="text-[#90a4ae] uppercase font-bold text-sm tracking-widest border-b border-[#455a64] w-full text-center pb-2">Vybavení</h3>
                  
                  {/* Slots Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Top Row: Empty, Head, Empty */}
                    <div></div>
                    <div className="w-16 h-16 bg-[#1b262c] border-2 border-[#90a4ae] rounded flex justify-center items-center cursor-pointer hover:border-[#f4f1e1] transition relative"
                         onClick={() => setSelectedItem(inventory.find(i => i.id === equipped['hlava']) || null)}>
                      {equipped['hlava'] ? <ItemIcon iconName={inventory.find(i => i.id === equipped['hlava'])?.icon || 'Shirt'} itemId={equipped['hlava']} className="transform scale-75" /> : <span className="text-[#455a64] text-xs">Hlava</span>}
                    </div>
                    <div></div>

                    {/* Middle Row: Main Hand, Chest, Off Hand */}
                    <div className="w-16 h-16 bg-[#1b262c] border-2 border-[#90a4ae] rounded flex justify-center items-center cursor-pointer hover:border-[#f4f1e1] transition relative"
                         onClick={() => setSelectedItem(inventory.find(i => i.id === equipped['hlavní ruka']) || null)}>
                      {equipped['hlavní ruka'] ? <ItemIcon iconName={inventory.find(i => i.id === equipped['hlavní ruka'])?.icon || 'Sword'} itemId={equipped['hlavní ruka']} className="transform scale-75" /> : <span className="text-[#455a64] text-xs">Zbraň</span>}
                    </div>
                    <div className="w-16 h-16 bg-[#1b262c] border-2 border-[#90a4ae] rounded flex justify-center items-center cursor-pointer hover:border-[#f4f1e1] transition relative"
                         onClick={() => setSelectedItem(inventory.find(i => i.id === equipped['hruď']) || null)}>
                      {equipped['hruď'] ? <ItemIcon iconName={inventory.find(i => i.id === equipped['hruď'])?.icon || 'Shirt'} itemId={equipped['hruď']} className="transform scale-75" /> : <span className="text-[#455a64] text-xs">Hruď</span>}
                    </div>
                    <div className="w-16 h-16 bg-[#1b262c] border-2 border-[#90a4ae] rounded flex justify-center items-center cursor-pointer hover:border-[#f4f1e1] transition relative"
                         onClick={() => setSelectedItem(inventory.find(i => i.id === equipped['druhá ruka']) || null)}>
                      {equipped['druhá ruka'] ? <ItemIcon iconName={inventory.find(i => i.id === equipped['druhá ruka'])?.icon || 'Shield'} itemId={equipped['druhá ruka']} className="transform scale-75" /> : <span className="text-[#455a64] text-xs">Štít</span>}
                    </div>

                    {/* Bottom Row: Ring, Neck, Empty */}
                    <div className="w-16 h-16 bg-[#1b262c] border-2 border-[#90a4ae] rounded flex justify-center items-center cursor-pointer hover:border-[#f4f1e1] transition relative"
                         onClick={() => setSelectedItem(inventory.find(i => i.id === equipped['prsten']) || null)}>
                      {equipped['prsten'] ? <ItemIcon iconName={inventory.find(i => i.id === equipped['prsten'])?.icon || 'Ring'} itemId={equipped['prsten']} className="transform scale-75" /> : <span className="text-[#455a64] text-xs">Prsten</span>}
                    </div>
                    <div className="w-16 h-16 bg-[#1b262c] border-2 border-[#90a4ae] rounded flex justify-center items-center cursor-pointer hover:border-[#f4f1e1] transition relative"
                         onClick={() => setSelectedItem(inventory.find(i => i.id === equipped['krk']) || null)}>
                      {equipped['krk'] ? <ItemIcon iconName={inventory.find(i => i.id === equipped['krk'])?.icon || 'Ring'} itemId={equipped['krk']} className="transform scale-75" /> : <span className="text-[#455a64] text-xs">Krk</span>}
                    </div>
                    <div></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-[#2b4c5e] border-2 border-[#455a64] p-4 rounded text-[#90a4ae]">
                  <h3 className="uppercase font-bold text-sm tracking-widest border-b border-[#455a64] pb-2 mb-2">Statistiky</h3>
                  <div className="flex justify-between py-1"><span>Zdraví:</span> <span className="font-bold text-[#f4f1e1]">{hp}</span></div>
                  <div className="flex justify-between py-1"><span>Síla (STR):</span> <span className="font-bold text-[#f4f1e1]">{stats.str}</span></div>
                  <div className="flex justify-between py-1"><span>Obratnost (DEX):</span> <span className="font-bold text-[#f4f1e1]">{stats.dex}</span></div>
                  <div className="flex justify-between py-1"><span>Odolnost (CON):</span> <span className="font-bold text-[#f4f1e1]">{stats.con}</span></div>
                  <div className="flex justify-between py-1"><span>Inteligence (INT):</span> <span className="font-bold text-[#f4f1e1]">{stats.intel}</span></div>
                  <div className="flex justify-between py-1"><span>Moudrost (WIS):</span> <span className="font-bold text-[#f4f1e1]">{stats.wis}</span></div>
                  <div className="flex justify-between py-1"><span>Charisma (CHA):</span> <span className="font-bold text-[#f4f1e1]">{stats.cha}</span></div>
                </div>
              </div>

              {/* Column 2: Selected Item Details */}
              <div className="flex-1 bg-[#2b4c5e] border-2 border-[#455a64] p-6 rounded flex flex-col items-center text-center relative min-h-[300px]">
                {selectedItem ? (
                  <>
                    <div className="w-48 h-48 mx-auto mb-4 bg-[#1b262c] border-2 border-[#b74b4b] rounded flex items-center justify-center">
                      {selectedItem && (
                        <ItemIcon iconName={selectedItem.icon} itemId={selectedItem.id} size={192} />
                      )}
                    </div>
                    
                    <h2 className="text-2xl text-[#f4f1e1] font-bold mb-1">{selectedItem.name}</h2>
                    <p className="text-[#90a4ae] text-sm uppercase mb-4">{selectedItem.type} • {selectedItem.slot}</p>
                    
                    <div className="bg-[#1e3746] w-full p-4 rounded text-sm text-[#e3dcc8] mb-4 text-left">
                      <p className="mb-2 italic">{selectedItem.description}</p>
                      <p className="font-bold text-[#90a4ae]">{selectedItem.stats}</p>
                    </div>

                    <p className="text-[#90a4ae] font-bold mb-6 text-lg">Hodnota: {selectedItem.sell_price} Zl.</p>
                    
                    <div className="mt-auto w-full flex flex-col gap-2">
                      {Object.values(equipped).includes(selectedItem.id) ? (
                        <button 
                          onClick={() => {
                            // Find which slot holds this item
                            const slotKey = Object.keys(equipped).find(k => equipped[k as keyof typeof equipped] === selectedItem.id);
                            if (slotKey) {
                              setEquipped({ ...equipped, [slotKey]: null });
                            }
                          }}
                          className="w-full py-2 bg-[#1b262c] border border-[#90a4ae] text-[#90a4ae] hover:bg-[#90a4ae] hover:text-[#1b262c] font-bold uppercase transition"
                        >
                          Odložit
                        </button>
                      ) : (
                        selectedItem.slot?.toLowerCase().trim() !== "žádný" && (
                          <button 
                            onClick={() => {
                              const normSlot = selectedItem.slot?.toLowerCase().trim();
                              // map slightly wrong slots
                              let finalSlot = normSlot;
                              if (normSlot.includes("hlavní") || normSlot.includes("zbraň") || normSlot.includes("ruka") && !normSlot.includes("druhá")) finalSlot = "hlavní ruka";
                              if (normSlot.includes("druhá") || normSlot.includes("štít")) finalSlot = "druhá ruka";
                              if (normSlot.includes("hruď") || normSlot.includes("brnění") || normSlot.includes("zbroj") || normSlot.includes("tělo")) finalSlot = "hruď";
                              
                              setEquipped({ ...equipped, [finalSlot]: selectedItem.id });
                            }}
                            className="w-full py-2 bg-[#b74b4b] border border-[#b74b4b] text-[#f4f1e1] hover:bg-[#8a3333] font-bold uppercase transition shadow-lg"
                          >
                            Vybavit
                          </button>
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-[#455a64] italic">
                    Vyberte předmět z batohu
                  </div>
                )}
              </div>

              {/* Column 3: Bag Grid */}
              <div className="flex-1 bg-[#2b4c5e] border-2 border-[#455a64] p-4 rounded">
                <h3 className="text-[#90a4ae] uppercase font-bold text-sm tracking-widest border-b border-[#455a64] pb-2 mb-4">Batoh</h3>
                
                <div className="grid grid-cols-4 gap-2">
                  {/* Render 20 slots minimum, fill with items first */}
                  {Array.from({ length: Math.max(20, inventory.length) }).map((_, i) => {
                    const item = inventory[i];
                    return (
                      <div 
                        key={i} 
                        onClick={() => item && setSelectedItem(item)}
                        className={`aspect-square bg-[#1b262c] border-2 rounded flex justify-center items-center transition relative
                          ${item ? 'border-[#90a4ae] cursor-pointer hover:border-[#f4f1e1]' : 'border-[#1e3746]'}
                          ${selectedItem?.id === item?.id ? 'ring-2 ring-[#b74b4b]' : ''}
                        `}
                      >
                        {item && (
                          <>
                            <ItemIcon iconName={item.icon || 'Package'} itemId={item.id} />
                            
                            {/* Equipped indicator */}
                            {Object.values(equipped).includes(item.id) && (
                              <div className="absolute top-1 right-1 w-2 h-2 bg-[#b74b4b] rounded-full"></div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

            {/* Epic Quest Banner */}
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
