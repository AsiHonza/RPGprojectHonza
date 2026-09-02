import React from 'react';
export const FormattedSystemLog = ({ text }: { text: string }) => {
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


const PATCH_NOTES = [
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
