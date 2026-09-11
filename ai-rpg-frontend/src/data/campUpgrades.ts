export interface CampUpgradeDef {
  id: string;
  name: string;
  category: 'alchymie' | 'kovarna' | 'zasoby' | 'pruzkum';
  description: string;
  flavor: string;
  cost: number;
  iconName: string;
  badge: string;
  effectDescription: string;
}

export const CAMP_UPGRADES: Record<string, CampUpgradeDef> = {
  alchemist_bench: {
    id: 'alchemist_bench',
    name: 'Alchymistická lavice',
    category: 'alchymie',
    description: 'Varný kotlík a sušárna bylin. Každé 2 herní dny automaticky uvaří 1x Léčivý lektvar (+25 HP).',
    flavor: 'Vůně třezalky, měsíčku a síry ti dodává jistotu, že zranění na cestách nebudou osudná.',
    cost: 50,
    iconName: 'FlaskConical',
    badge: 'Produkce lektvarů',
    effectDescription: '1x Léčivý lektvar každé 2 dny'
  },
  blacksmith_forge: {
    id: 'blacksmith_forge',
    name: 'Polní kovárna a kovadlina',
    category: 'kovarna',
    description: 'Přenosná výheň k údržbě zbraní a zbroje. Po každém odpočinku u ohně získáš buff Broušená ocel (+1 k fyzickému zranění na 3 souboje).',
    flavor: 'Rytmické cinkání kladiva v chladném ránu připomíná řemeslnou pýchu starých kovářů.',
    cost: 75,
    iconName: 'Hammer',
    badge: 'Bojová údržba',
    effectDescription: '+1 k poškození po odpočinku (3 souboje)'
  },
  supply_stash: {
    id: 'supply_stash',
    name: 'Zásobárna a Udírna',
    category: 'zasoby',
    description: 'Chráněný přístřešek s kouřovou komorou pro sušení masa. Dlouhý odpočinek v táboře spotřebuje pouze 1 jídlo (místo 2).',
    flavor: 'Dobře vyuzené maso a vzduchotěsně zabalený suchar ti zachrání život v kruté zimě.',
    cost: 60,
    iconName: 'PackageCheck',
    badge: 'Úspora jídla',
    effectDescription: 'Dlouhý odpočinek stojí jen 1 jídlo'
  },
  scout_post: {
    id: 'scout_post',
    name: 'Strážní vyhlídka',
    category: 'pruzkum',
    description: 'Zvýšená hlídka na stromě s výhledem do kraje. Zcela eliminuje noční přepadení v divočině a zvyšuje štěstí při průzkumu okolí.',
    flavor: 'Z výšky koruny starého dubu máš přehled o každém pohybu skřetích hlídek i vlků.',
    cost: 80,
    iconName: 'Binoculars',
    badge: 'Bezpečnost & Průzkum',
    effectDescription: 'Bezpečné spaní v divočině + štěstí k lootu'
  }
};
