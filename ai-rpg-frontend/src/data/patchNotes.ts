export const PATCH_NOTES = [
  {
    version: "Beta 0.8",
    date: "Září 2026",
    title: "AAA High Fantasy UI Upgrade",
    changes: [
      {
        category: "Grafika a Animace",
        items: [
          "Přechod na AAA minimalismus - obrazovka je nyní čistá a zaměřená na příběh a ilustrace.",
          "Zavedena podpora filmových animací přes Framer Motion (plynulé fade-in efekty, rozmazání pozadí).",
          "Změna typografie na Google Fonts 'Cinzel' (velkolepé nadpisy) a 'Lora' (skvěle čitelný knižní příběh).",
          "Tlačítka z hlavní obrazovky přesunuta do nového elegantního vysouvacího 'Master Menu'.",
          "HP a XP se nyní zobrazují formou elegantních plnících se gradientních linek vedle avataru.",
          "Předělán herní deník (StoryLog) do podoby nádherných průsvitných karet se silným fantasy nádechem a inkoustovými akcenty.",
          "Magické pole pro psaní příkazů - plovoucí, stínované okraje s levitujícími detaily."
        ]
      }
    ]
  },
  {
    version: "Beta 0.7",
    date: "Září 2026",
    title: "Kompletní přesun UI z page.tsx",
    changes: [
      {
        category: "Architektura",
        items: [
          "Úplně vyčištěný hlavní soubor hry (page.tsx) od balastu uživatelského rozhraní.",
          "Vyčleněny zbylé moduly: Vlastnosti (StatsModal), Dovednosti (SkillsModal), Nastavení (SettingsModal) a Horní Navigační Lišta (PlayerHeader).",
          "Audio přehrávač (hlasitost, hudba, zvuky) a notifikace přesunuty pod hlavičku globálního Zustand Game Store.",
          "Aplikace je nyní 100% Modulární Feature-Sliced Design. Dokončena velká refaktorizace, připraveno na designové animace."
        ]
      }
    ]
  },

  {
    "version": "Beta 0.5 - Architektura & Království",
    "date": "02. 09. 2026",
    "changes": [
      "🗺️ Mapa 30x30 s inteligentním Lazy Loadingem bodů zájmu.",
      "👑 7 Království - Svět Aelthgardu je nyní rozdělen do 7 politických a přírodních regionů pomocí Voronoi diagramu.",
      "⚙️ Zásadní refaktoring - Přechod na profi Zustand State Management.",
      "🎨 Vizuální úpravy mapy - Přidána speciální barva pro Mrtvou zónu uprostřed."
    ]
  },
  {
    version: "v1.2.0 - Vládci Osudu & Objevitelé",
    date: "Září 2026",
    changes: [
      "🗺️ Řízený Sandbox: Nový kampaňový režim hry! AI pro tebe při založení postavy vymyslí pevnou mapu, zápletku a skrytá tajemství.",
      "📜 Interaktivní Mapa: Hraješ-li kampaň, máš nově přístup k interaktivní vizuální mapě světa a objevených cest.",
      "🏕️ Epické Cestování: Každý krok cesty do nové lokace stojí 1 jídlo. Pán jeskyně hází tajně d20 kostkou na události (od klidné cesty po smrtící léčku).",
      "👥 Deník Postav (Kodex): V horním menu nově najdeš vizitkář! Hra si pamatuje každé důležité NPC a jejich vztah k tobě (zelená/žlutá/červená).",
      "📱 Mobilní UI & Notifikace: Kompaktní rozhraní pro telefony a epické oznámení přes celou obrazovku, když splníš quest!"
    ]
  },
  {
    version: "v1.1.0 - Magie a Ocel",
    date: "Starší",
    changes: [
      "✨ Systém kouzel a cantripů pro magická povolání.",
      "⚔️ Zbraně, zbroje a možnost se vybavovat z inventáře.",
      "🎵 Adaptivní ambientní hudba (Město, Divočina, Boj)."
    ]
  }
];
