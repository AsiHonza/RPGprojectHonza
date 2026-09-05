export interface GodLore {
  id: string;
  name: string;
  title: string;
  domain: string;
  icon: string;
  color: string;
  description: string;
  philosophy: string;
}

export interface KingdomLore {
  id: number;
  name: string;
  archetype: string;
  motto: string;
  capital?: string;
  rulerArchetype: string;
  atmosphere: string;
  badge: string;
  color: string;
  accentBorder: string;
  bgGradient: string;
  description: string;
  threat: string;
}

export const WORLD_LORE = {
  name: 'Aelthgard',
  subtitle: 'Země Procitnutí a Války Bohů',
  tone: 'Temná pohádková fantasy (Mix Fable a Zaklínače)',
  overview: 
    'Aelthgard je rozsáhlý kontinent zdánlivě malebných hvozdů, majestátních kamenných měst a pradávných ruin. Pod tímto pohádkovým povrchem však vře zkorumpovaný a krví nasáklý svět. Dny míru pominuly – staří bohové se zhmotňují mezi smrtelníky a jejich stoupenci se navzájem vraždí v náboženském fanatismu.',
  magicConcept:
    'Magie v Aelthgardu není věda, kterou lze vyčíst ze starých svitků. Je to Procitnutí – vzácný a děsivý božský dar či prokletí. Ti, v nichž se magie probudila, jsou nazýváni Vyvolení. Ostatní se jich bojí, uctívají je, nebo je loví pro jejich nadpřirozenou krev.',
  
  gods: [
    {
      id: 'solarian',
      name: 'Solarian',
      title: 'Bůh Slunce, Řádu a Krve',
      domain: 'Zákon, Světlo, Neúprosný Řád',
      icon: '☀️',
      color: 'text-amber-600',
      description: 'Původně uctíván jako dárce tepla a spravedlnosti. V posledních letech se jeho víra proměnila ve fanatickou inkvizici, která spálí každého, kdo nezapadá do absolutního Řádu.',
      philosophy: 'Jen v posvátném ohni a železné kázni může svět nalézt spásu před chaosem.'
    },
    {
      id: 'vyldia',
      name: 'Vyldia',
      title: 'Bohyně Hvozdů, Zvěře a Krvavého Rituálu',
      domain: 'Divoká Příroda, Cyklus Života a Smrti, Chaos',
      icon: '🌿',
      color: 'text-emerald-600',
      description: 'Bohyně pradávných hlubokých lesů a nezkrotné divočiny. Odmítá kamenná města i civilizované zákony. Její přízeň je vykoupena krevními rituály a návratem k zákonu predátora.',
      philosophy: 'Slabí jsou potravou pro silné. Příroda neodpouští slabost ani civilizační přetvářku.'
    },
    {
      id: 'kull',
      name: 'Kull',
      title: 'Pán Stínů, Šepotu a Zakázané Moci',
      domain: 'Temnota, Tajemství, Pakt a Iluze',
      icon: '👁️',
      color: 'text-purple-600',
      description: 'Bůh skrytý v temných koutech mysli a na zapadlých křižovatkách. Našeptává smrtelníkům sliby nezměrné moci a učí je, že i člověk se může stát bohem – stačí jen podepsat pakt.',
      philosophy: 'Zákony a morálka jsou jen okovy pro slabochy. Skutečná svoboda leží v temnotě poznání.'
    }
  ] as GodLore[],

  kingdoms: [
    {
      id: 1,
      name: 'Valerijské Impérium',
      archetype: 'Upadající Impérium & Zkorumpovaná Šlechta',
      motto: 'Zlato třpytí se i na hrobě.',
      rulerArchetype: 'Dekadentní císařská rodina intrikánů',
      atmosphere: 'Mramorové paláce s loupající se pozlátkou, tajné jedy v pohárech a zoufalý lid v podhradí.',
      badge: '👑',
      color: 'text-amber-800',
      accentBorder: 'border-amber-600/40',
      bgGradient: 'from-amber-900/10 via-amber-600/5 to-transparent',
      description: 'Někdejší srdce kontinentu. Dnes je to dekadentní říše, kde šlechtické rody utrácejí poslední bohatství za okázalé plesy, zatímco provincie upadají v chaos.',
      threat: 'Vnitřní zrada a nekontrolovatelné povstání hladovějící chudiny.'
    },
    {
      id: 2,
      name: 'Svatá říše Solariova',
      archetype: 'Teokracie & Náboženský Fanatismus',
      motto: 'V ohni pravda, v krvi řád.',
      rulerArchetype: 'Vysocí preláti a inkvizitoři Slunce',
      atmosphere: 'Monumentální katedrály z bílého kamene, plápolající hranice a zvuk zvonů svolávající k očistě.',
      badge: '⚔️',
      color: 'text-yellow-700',
      accentBorder: 'border-yellow-600/40',
      bgGradient: 'from-yellow-900/10 via-yellow-600/5 to-transparent',
      description: 'Země řízená železnou rukou církve. Zde není místo pro pochybnosti – každý občan musí uctívat Solariana, jinak skončí jako oběť na posvátné hranici.',
      threat: 'Svatá křížová výprava proti všem sousedním národům a netolerantní honební čety.'
    },
    {
      id: 3,
      name: 'Kmeny z Hlubokých hvozdů',
      archetype: 'Divoké Kmeny & Krevní Přežití',
      motto: 'Les nezapomíná. Krev volá krev.',
      rulerArchetype: 'Šamani, náčelníci a rohatí druidi',
      atmosphere: 'Neprostupné mlžné bažiny, totemy z lebek zvířat a noční bubnování kolem posvátných ohňů.',
      badge: '🐺',
      color: 'text-emerald-800',
      accentBorder: 'border-emerald-600/40',
      bgGradient: 'from-emerald-900/10 via-emerald-600/5 to-transparent',
      description: 'Hluboké pralesy, kam se žádné císařské vojsko neodváží vstoupit. Zdejší kmeny uctívají Vyldii a žijí v tvrdé symbióze s nejnebezpečnějšími tvory Aelthgardu.',
      threat: 'Divoké nájezdy bestií a krvavé rituály za úplňku.'
    },
    {
      id: 4,
      name: 'Svobodná města',
      archetype: 'Obchodní Gildy & Žoldnéřská Oligarchie',
      motto: 'Každý člověk má svou cenu.',
      rulerArchetype: 'Rada obchodních magnátů a cechmistrů',
      atmosphere: 'Rušné přístavy, dlážděné uličky osvětlené lucernami, námořníci, pašeráci a vůně koření.',
      badge: '⚓',
      color: 'text-blue-800',
      accentBorder: 'border-blue-600/40',
      bgGradient: 'from-blue-900/10 via-blue-600/5 to-transparent',
      description: 'Bohatá přístavní konfederace měst bez krále. Zde vládne ten, kdo má nejvíce zlaťáků a nejlépe zaplacené žoldnéře. Útočiště pro dobrodruhy i psance.',
      threat: 'Stínové války mezi cechy zlodějů a nelítostné vyděračské syndikáty.'
    },
    {
      id: 5,
      name: 'Karanténní Zóna',
      archetype: 'Magická Pustina & Monstrózní Anomálie',
      motto: 'Zde pláčou i kameny.',
      rulerArchetype: 'Nikdo – země zapomenutá bohy',
      atmosphere: 'Fialové záblesky na obzoru, zmutovaná fauna, rozpadlé věže vznášející se v povětří a věčná mlha.',
      badge: '☣️',
      color: 'text-purple-800',
      accentBorder: 'border-purple-600/40',
      bgGradient: 'from-purple-900/10 via-purple-600/5 to-transparent',
      description: 'Pozůstatek obří magické katastrofy zvané Velké Rozlomení. Realita je zde pokřivená, vzduch pálí na plicích a ruiny střeží nepopsatelná monstra.',
      threat: 'Šíření zkažených anomálií a únik prastarých nestvůr do okolních zemí.'
    },
    {
      id: 6,
      name: 'Železný Práh',
      archetype: 'Severní Hradba & Militarizovaná Stráž',
      motto: 'Zde zlo neprojde.',
      rulerArchetype: 'Válečný maršál a řád Strážců Hraničního ledu',
      atmosphere: 'Zasněžené vrcholky hor, masivní černé hradby ze žuly, dunění bubnů a chladná ocel.',
      badge: '🛡️',
      color: 'text-slate-800',
      accentBorder: 'border-slate-500/40',
      bgGradient: 'from-slate-900/10 via-slate-600/5 to-transparent',
      description: 'Drsná horská pevnost na severu kontinentu. Všichni obyvatelé jsou cvičeni v boji od útlého věku, aby bránili civilizovaný jih před mrazivými hrůzami.',
      threat: 'Nekonečné vlny nájezdníků z ledových pustin a mraziví obři.'
    },
    {
      id: 7,
      name: 'Tajemné Útočiště',
      archetype: 'Izolované Sídlo Vyvolených & Magické Věže',
      motto: 'Poznání je jedinou nesmrtelností.',
      rulerArchetype: 'Konkláve Prvních Procitnutých',
      atmosphere: 'Létající knihovny, krystalové rezonátory, tiché zahrady plné kouzelných světlušek.',
      badge: '🔮',
      color: 'text-indigo-800',
      accentBorder: 'border-indigo-600/40',
      bgGradient: 'from-indigo-900/10 via-indigo-600/5 to-transparent',
      description: 'Skryté útočiště pro ty, v nichž se probudila magie. Chrání magické relikvie před církví Solariana a snaží se rozluštit pravou podstatu Procitnutí.',
      threat: 'Zakázané experimenty s trhlinami v realitě a posedlost absolutní mocí.'
    }
  ] as KingdomLore[]
};
