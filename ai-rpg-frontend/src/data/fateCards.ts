/**
 * Fate Cards / Znamení Osudu - Pool & Drafting System
 * Complete canonical card database for Aelthgard RPG
 */

export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type CardType = 'combat' | 'narrative' | 'pact' | 'class';

export interface FateCard {
  id: string;
  name: string;
  rarity: CardRarity;
  type: CardType;
  classReq?: string;
  icon: string;
  tag: string;
  shortDesc: string;
  mechanicsDetail: string;
  offlineEffectDesc: string;
  synergyTip: string;
  flavorText: string;
}

export const FATE_CARDS_POOL: FateCard[] = [
  // ==========================================
  // 12 CLASS-SPECIFIC CARDS
  // ==========================================
  {
    id: 'barbarian_blood_frenzy',
    name: 'Krvavý zápal',
    rarity: 'epic',
    type: 'class',
    classReq: 'Barbar',
    icon: 'Flame',
    tag: 'Vyldia',
    shortDesc: 'Pod 50% životů způsobují tvé útoky masivní bonusové poškození.',
    mechanicsDetail: 'Pokud máš méně než 50% HP, k hodům na poškození se přičítá +1k8 fyzického zranění.',
    offlineEffectDesc: 'V dialozích odemyká brutální zastrašení banditů a stráží bez nutnosti boje.',
    synergyTip: 'Vynikající s obouručními zbraněmi a vysokou Odolností (CON).',
    flavorText: '„Když v žilách vře krev předků, bolest se stává pouhým palivem pro hněv.“'
  },
  {
    id: 'fighter_shield_wall',
    name: 'Obranná zeď',
    rarity: 'rare',
    type: 'class',
    classReq: 'Bojovník',
    icon: 'Shield',
    tag: 'Zocelení',
    shortDesc: 'Úspěšný kryt štítem nebo odražení úderu ti vrátí akční energii.',
    mechanicsDetail: 'Když nepřítel mine útok proti tvému AC, získáváš +2 k dalšímu hodu na útok.',
    offlineEffectDesc: 'Záchrana družiny z přepadení na Staré křižovatce a snížení zranění z léčky na 0.',
    synergyTip: 'Kombinuj se štítem a těžkou plátovou zbrojí pro neprostupnou obranu.',
    flavorText: '„Stůj jako skála, o kterou se tříští i ty nejdivočejší vlny.“'
  },
  {
    id: 'rogue_poison_blade',
    name: 'Jedová čepel',
    rarity: 'rare',
    type: 'class',
    classReq: 'Tulák',
    icon: 'Skull',
    tag: 'Cech stínů',
    shortDesc: 'Útoky ze zálohy infikují cíl zákeřným neurotoxinem.',
    mechanicsDetail: 'Útok ze zálohy aplikuje otrávení: 3k4 poškození na začátku každého kola po 3 kola.',
    offlineEffectDesc: 'Umožňuje tajně otrávit zásoby vína v táboře banditů před přepadením.',
    synergyTip: 'Synergizuje s dýkami, vysokou Obratností a skrytým pohybem.',
    flavorText: '„Čistá ocel zabíjí tělo, kapka jedu zlomí i celou armádu.“'
  },
  {
    id: 'wizard_chain_arcana',
    name: 'Řetězová arkána',
    rarity: 'epic',
    type: 'class',
    classReq: 'Kouzelník',
    icon: 'Sparkles',
    tag: 'Probuzení',
    shortDesc: 'Tvá útočná kouzla přeskakují a explodují i na vedlejší cíle.',
    mechanicsDetail: 'Každé útočné kouzlo zraní sekundární cíl za 50% původního poškození.',
    offlineEffectDesc: 'V offline průzkumu automaticky dešifruje prastaré runy v kryptě sv. Judity.',
    synergyTip: 'Ideální proti skupinám vlků, troglů a kultistů.',
    flavorText: '„Magie není přímka. Je to bouře hledající nejkratší cestu do země.“'
  },
  {
    id: 'cleric_solarian_verdict',
    name: 'Solarianův soud',
    rarity: 'rare',
    type: 'class',
    classReq: 'Klerik',
    icon: 'Sun',
    tag: 'Solarian',
    shortDesc: 'Tvá léčivá kouzla trestají nemrtvé a kacíře v okolí.',
    mechanicsDetail: 'Při použití léčení udělíš nejbližšímu nepříteli posvátné zářivé poškození rovné polovině vyléčených HP.',
    offlineEffectDesc: 'Inkvizitor Kaelen a kněží k tobě chovají okamžitou úctu (+5 k důvěře).',
    synergyTip: 'Obrací defenzivní léčení v mocný ofenzivní nástroj proti temnotě.',
    flavorText: '„Kde se rozlije posvátné světlo, tam temnota shoří v popel.“'
  },
  {
    id: 'bard_battle_anthem',
    name: 'Rytmus bitvy',
    rarity: 'epic',
    type: 'class',
    classReq: 'Bard',
    icon: 'Music',
    tag: 'Valerijský cech',
    shortDesc: 'S každým kolem boje tvá hudba stupňuje šanci na kritický zásah.',
    mechanicsDetail: 'Každé kolo v boji přidává +5% šanci na kritický zásah (až do maxima +25%).',
    offlineEffectDesc: 'Poskytuje trvalou 20% slevu u všech městských obchodníků a nocleh zdarma.',
    synergyTip: 'Skvěle funguje v dlouhých boss fightech a vyjednáváních.',
    flavorText: '„Správná balada dokáže zastavit krvácející ránu i vyvolat povstání.“'
  },
  {
    id: 'ranger_predator_instinct',
    name: 'Lovecký instinkt',
    rarity: 'rare',
    type: 'class',
    classReq: 'Hraničář',
    icon: 'Compass',
    tag: 'Vyldia',
    shortDesc: 'Tvé střely nacházejí slabá místa a ignorují polovinu zbroje cíle.',
    mechanicsDetail: 'Útoky z luku a kuše ignorují 50% zbroje (AC) cíle.',
    offlineEffectDesc: 'Při cestování divočinou automaticky ulovíš potravu (+1 jídlo za každý navštívený les).',
    synergyTip: 'V kombinaci s vysokou Obratností promění tvůj luk ve smrtící zbraň.',
    flavorText: '„Tráva si pamatuje každý krok a vítr nese vůni tvého strachu.“'
  },
  {
    id: 'paladin_sacred_retribution',
    name: 'Svatá odveta',
    rarity: 'epic',
    type: 'class',
    classReq: 'Paladin',
    icon: 'ShieldAlert',
    tag: 'Solarian',
    shortDesc: 'Nepřátelé, kteří tě zasáhnou, jsou spáleni posvátným plamenem.',
    mechanicsDetail: 'Při utržení poškození nablízko vrátíš útočníkovi 4 body zářivého poškození.',
    offlineEffectDesc: 'Umožňuje posvětit znesvěcený oltář v kryptě a zlomit kletbu na Annině prstenu.',
    synergyTip: 'Ideální pro tankovací styl boje proti přesile nepřátel.',
    flavorText: '„Moje zbroj je pevná, ale má víra je skutečnou čepelí mého boha.“'
  },
  {
    id: 'sorcerer_volatile_blood',
    name: 'Nestálá krev',
    rarity: 'legendary',
    type: 'class',
    classReq: 'Čaroděj',
    icon: 'Zap',
    tag: 'Probuzení',
    shortDesc: 'Tvá vrozená magie rezonuje tak silně, že občas nespálí žádný spell slot.',
    mechanicsDetail: '25% šance na seslání libovolného kouzla bez spotřeby kouzelnického slotu.',
    offlineEffectDesc: 'NPC čarodějové a šamani vnímají tvou mocnou auru a bojí se tě zradit.',
    synergyTip: 'Umožňuje řetězit silná kouzla i v situacích s nedostatkem zdrojů.',
    flavorText: '„Nenaučil jsem se kouzlit. Narodil jsem se jako živá jiskra.“'
  },
  {
    id: 'warlock_soul_harvest',
    name: 'Sklizeň duší',
    rarity: 'epic',
    type: 'class',
    classReq: 'Černokněžník',
    icon: 'Ghost',
    tag: 'Kull',
    shortDesc: 'Smrt nepřítele vyživuje tvou temnou entitu a léčí tě.',
    mechanicsDetail: 'Zabití libovolného nepřítele ti okamžitě obnoví 15% tvého maximálního zdraví.',
    offlineEffectDesc: 'Umožňuje v dialozích odhalit skryté hříchy a provinění obyvatel Oakhaven.',
    synergyTip: 'Udržuje tě naživu i v těch nejkrutějších vlnách nepřátel bez nutnosti lektvarů.',
    flavorText: '„Každý dech, který vyhasne pod mou rukou, prodlužuje můj vlastní.“'
  },
  {
    id: 'druid_thorn_embrace',
    name: 'Trnové objetí',
    rarity: 'rare',
    type: 'class',
    classReq: 'Druid',
    icon: 'Trees',
    tag: 'Vyldia',
    shortDesc: 'Příroda tě objímá – rychleji regeneruješ a divočina ti neublíží.',
    mechanicsDetail: 'Odpočinek v táboře léčí o 50% více HP a zvířecí monstra na tebe nezaútočí první.',
    offlineEffectDesc: 'Odstraňuje riziko náhodných přepadení divokou zvěří při cestování po mapě.',
    synergyTip: 'Umožňuje přežít v divočině bez plýtvání zásobami jídla a lektvarů.',
    flavorText: '„Kdo kráčí v souladu s lesem, nenajde v něm nepřítele, nýbrž kolébku.“'
  },
  {
    id: 'monk_ki_flow',
    name: 'Tok energie Ki',
    rarity: 'epic',
    type: 'class',
    classReq: 'Mnich',
    icon: 'Wind',
    tag: 'Zocelení',
    shortDesc: 'Tvé tělo je živou zbraní. Bez zbroje se tvé reflexy stávají nadlidskými.',
    mechanicsDetail: 'Pokud nemáš vybavenou zbroj, k tvému AC se přičítá bonus Moudrosti a získáváš +1 k rychlosti.',
    offlineEffectDesc: 'Odemyká bleskové reakce v krizových situacích (např. zachycení letící dýky ze stínu).',
    synergyTip: 'Maximalizuj Moudrost a Obratnost pro nepolapitelný a smrtící styl boje.',
    flavorText: '„Ocel se může zlomit. Trénovaná mysl a zpevněná pěst nikdy.“'
  },

  // ==========================================
  // UNIVERSAL CARDS (COMBAT, NARRATIVE, PACTS)
  // ==========================================
  {
    id: 'univ_silver_tongue',
    name: 'Stříbrný jazyk',
    rarity: 'rare',
    type: 'narrative',
    icon: 'MessageSquare',
    tag: 'Cech',
    shortDesc: 'Tvá slova mají váhu zlata. Dokážeš přesvědčit i zatvrzelého nepřítele.',
    mechanicsDetail: 'Všechny hody na Přesvědčování a Klamání mají výhodu (dvojitý hod d20).',
    offlineEffectDesc: 'V offline dialozích odemyká mírové řešení konfliktů (vyjednání průchodu bez boje).',
    synergyTip: 'Umožňuje získat nejvyšší možné odměny za splněné úkoly.',
    flavorText: '„Správné slovo v pravý čas přetne víc hrdel než stovka naostřených mečů.“'
  },
  {
    id: 'univ_iron_will',
    name: 'Železná vůle',
    rarity: 'common',
    type: 'combat',
    icon: 'Shield',
    tag: 'Zocelení',
    shortDesc: 'V krizovém momentě tvé svaly zkamení a odmítnou povolit.',
    mechanicsDetail: 'Pokud tvé životy klesnou pod 25%, tvé AC se okamžitě zvýší o +3.',
    offlineEffectDesc: 'Zabraňuje okamžité smrti při smrtelném zranění – zanechá postavu na 1 HP.',
    synergyTip: 'Skvělá záchranná brzda pro každou postavu v těžkých dungeonech.',
    flavorText: '„Tělo křičí bolestí, ale vůle mu poroučí vydržet ještě jeden úder.“'
  },
  {
    id: 'univ_sixth_sense',
    name: 'Šestý smysl',
    rarity: 'epic',
    type: 'narrative',
    icon: 'Eye',
    tag: 'Probuzení',
    shortDesc: 'Cítíš hrozby dříve, než se zhmotní. Pasti a zrady tě nezaskočí.',
    mechanicsDetail: 'Nemůžeš být překvapen v prvním kole boje a máš +3 k hodům na Iniciativu.',
    offlineEffectDesc: 'V kryptě sv. Judity a opuštěném dole automaticky odhalí pasti bez poškození.',
    synergyTip: 'Chrání tě před přepadením ze zálohy a dává ti první úder.',
    flavorText: '„Chlad v zátylku nikdy nelže. Smrt už natáhla ruku, ale tys stihl uhnout.“'
  },
  {
    id: 'univ_blood_pact',
    name: 'Krvavý pakt',
    rarity: 'epic',
    type: 'pact',
    icon: 'Flame',
    tag: 'Kull',
    shortDesc: 'Pakt se stíny: Způsobuješ o 35% vyšší poškození, ale lektvary tě léčí o polovinu méně.',
    mechanicsDetail: '+35% k veškerému poškození. Všechny léčivé efekty a lektvary léčí pouze o 50% HP.',
    offlineEffectDesc: 'Inkvizice Solariana tě začne podezřívat z kacířství, ale bandité se tě bojí.',
    synergyTip: 'Pro hráče hrající styl "high risk, high reward".',
    flavorText: '„Moc je sladká, ale její cena je psána v kapkách tvého vlastního života.“'
  },
  {
    id: 'univ_second_wind',
    name: 'Druhý dech',
    rarity: 'common',
    type: 'combat',
    icon: 'Heart',
    tag: 'Zocelení',
    shortDesc: 'Zvýšená regenerace sil a vyšší fond základního zdraví.',
    mechanicsDetail: 'Trvale zvyšuje tvé Maximální HP o +10 a léčí tě na maximum.',
    offlineEffectDesc: 'Umožňuje nést těžká břemena a odolávat únavě při dlouhém pochodu.',
    synergyTip: 'Univerzální pilíř pro každého hrdinu, který chce déle přežít.',
    flavorText: '„Když plíce pálí a nohy těžknou, hrdina najde skrytý pramen síly.“'
  },
  {
    id: 'univ_shadow_walker',
    name: 'Stínový chodec',
    rarity: 'rare',
    type: 'narrative',
    icon: 'Moon',
    tag: 'Kull',
    shortDesc: 'Stíny se stávají tvým pláštěm. Můžeš procházet střeženými oblastmi bez povšimnutí.',
    mechanicsDetail: '+4 k hodům na Plížení. Útok ze stínu má o +20% vyšší šanci na zásah.',
    offlineEffectDesc: 'Umožňuje proplížit se kolem stráží u městské brány nebo v táboře bez spuštění poplachu.',
    synergyTip: 'Otevírá tajné cesty do zamčených truhel a archivů.',
    flavorText: '„Kde není světlo, tam není svědků.“'
  },
  {
    id: 'univ_bounty_hunter',
    name: 'Lovec odměn',
    rarity: 'common',
    type: 'narrative',
    icon: 'Coins',
    tag: 'Cech',
    shortDesc: 'Tvůj zrak okamžitě rozpozná cennosti a skryté váčky se zlaťáky.',
    mechanicsDetail: 'Všechny nálezy zlaťáků a odměny za zakázky jsou navýšeny o +25%.',
    offlineEffectDesc: 'U vývěsky zakázek v Oakhaven odemyká dodatečné odměny od rychtáře Vanea.',
    synergyTip: 'Urychluje nákup lepší výstroje a vylepšování tábora.',
    flavorText: '„Zlato voní všude stejně – ať už leží v truhle krále, nebo v kapse mrtvého bandity.“'
  },
  {
    id: 'univ_phoenix_spark',
    name: 'Fénixova jiskra',
    rarity: 'legendary',
    type: 'combat',
    icon: 'Sparkles',
    tag: 'Solarian',
    shortDesc: 'Dotek slunečního boha. Jednou za dobrodružství tě smrt nezabije, ale znovuzrodí.',
    mechanicsDetail: 'Při utržení fatálního poškození vstaneš s 50% HP a všichni nepřátelé utrží 15 radiant zranění.',
    offlineEffectDesc: 'V offline ději zabrání obrazovce smrti a vytvoří dramatický zázrak před zraky NPC.',
    synergyTip: 'Absolutní run-saver pro nejtěžší souboje v hlubinách dolů a kláštera.',
    flavorText: '„Plamen, který odmítne zhasnout, spálí i samotného hrobníka.“'
  }
];

/**
 * Generates a draft of 3 cards for the player on level up.
 * Guarantees that at least one card is class-specific (if any available and not yet owned).
 */
export function getRandomFateCardDraft(
  playerClass: string,
  ownedCardIds: string[] = [],
  count: number = 3
): FateCard[] {
  const ownedSet = new Set(ownedCardIds);
  const availableCards = FATE_CARDS_POOL.filter(c => !ownedSet.has(c.id));

  const classCards = availableCards.filter(c => 
    c.classReq && c.classReq.toLowerCase() === (playerClass || '').toLowerCase()
  );
  const neutralCards = availableCards.filter(c => !c.classReq);

  const draft: FateCard[] = [];

  // 1. Guarantee 1 class card if available
  if (classCards.length > 0) {
    const randomClassCard = classCards[Math.floor(Math.random() * classCards.length)];
    draft.push(randomClassCard);
  }

  // 2. Fill the rest from neutral + remaining class cards
  const remainingPool = availableCards.filter(c => !draft.some(d => d.id === c.id));
  
  // Shuffle remaining
  const shuffled = [...remainingPool].sort(() => Math.random() - 0.5);

  for (const card of shuffled) {
    if (draft.length >= count) break;
    draft.push(card);
  }

  return draft;
}
