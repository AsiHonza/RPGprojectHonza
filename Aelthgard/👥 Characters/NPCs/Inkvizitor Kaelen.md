---
title: Inkvizitor Kaelen
tags: [character, npc, inquisitor, solarian, oakhaven]
npc_id: inkvizitor_kaelen
location_id: oakhaven
location: "[[Oakhaven]] – [[Hostinec U Zlomeného štítu]]"
gender: muz
type: quest-giver, autorita
disposition: neutral
faction_id: teokracie_solariova
quests:
  - Q002
trade_items:
  - { name: "Svěcená voda Solariana", type: "lektvar", price: 15 }
  - { name: "Sluneční zápalná tinktura", type: "lektvar", price: 25 }
  - { name: "Příručka 'Kladivo na kacíře'", type: "cennost", price: 40 }
---

# Inkvizitor Kaelen

**Lokace:** [[Oakhaven]] – [[Hostinec U Zlomeného štítu]]  
**Typ:** Quest-giver, Církevní autorita / Inkvizitor  
**Vztah k hráči:** Chladný / Vyšetřující  
**Frakce:** [[Teokracie Solariova]]  

---

## Vzhled
Muž kolem čtyřicítky s přísně řezanou tváří, popelavě plavými vlasy ostříhanými nakrátko a pronikavýma jantarovýma očima, které si každého prohlížejí jako obžalovaného před tribunálem. Nosí těžký cestovní plášť barvy popela sepnutý stříbrnou sponou ve tvaru slunce protnutého mečem – symbolem boha [[Religion#Solarian|Solariana]]. Pod pláštěm se rýsuje leštěný ocelový kyrys bez zbytečných ozdob a u boku mu visí dlouhý meč s čepelí zčernalou od rituálních ohňů. Na krku mu cinká stříbrná kadidelnice se zápalnými bylinami proti černé magii.

## Osobnost
Kaelen není tupý hrdlořez ani hysterický fanatik; je to chladný, vysoce vzdělaný vyšetřovatel s břitkým intelektem a absolutním nedostatkem soucitu. Hovoří tichým, vyrovnaným hlasem, který v místnosti působí děsivěji než řev opilých žoldnéřů. Lidskou slabost považuje za palivo pro kacířství. Je hluboce cynický vůči venkovskému folklóru a pokrytectví císařských úředníků – věří, že lidé lžou, podvádějí a zaprodávají se stínům z pouhé malichernosti.

## Motivace & Cíle
- **Najít ohnisko kacířství:** Zaznamenal magický záškub po pohnutí s Anniným prstenem v Oakhaven a stopuje kacíře z [[Tajemné Útočiště]].
- **Očistit Ruiny kláštera:** Zjistit, co se probudilo v kryptách sv. Judity ([[Ruiny kláštera]]), a zničit jakékoliv relikvie spojené s kultem boha [[Religion#Kull|Kulla]].
- **Využít pěšáky:** Považuje dobrodruhy a žoldáky za levné "dřevo do kamen". Pokud hráč v kryptě padne, žádná škoda; pokud uspěje, poslouží Solarianovu řádu.

## Questy
- [[Q002_SepotKrypty]] – zadavatel hlavní vyšetřovací linie a oponent v morálním dilematu.

## Vazby a vztahy
- **[[Strážmistr Aldric]]:** Pohrdá jím jako líným provinciálem, který zavírá oči před zlem. Vydírá ho hrozbou povolání plného očistného kontingentu inkvizice.
- **[[Boris Mlynář]]:** Považuje ho za podezřelého. Tuší, že mlynářova zesnulá žena nebyla obyčejná venkovanka.
- **[[Teokracie Solariova]]:** Oddaný služebník Nejvyššího Primáta Malachaie z řádu Plamenného meče.
- **[[Ruiny kláštera]]:** Staré znesvěcené opatství považuje za otevřenou ránu na tváři země, kterou je nutné vypálit do základů.

## Inventář & Zboží
Kaelen neobchoduje rád s nevěřícími, ale pro "práci v božím zájmu" je ochoten prodat očistné proprietky:
- *Svěcená voda Solariana* (způsobuje těžké popáleniny nemrtvým a stínovým bytostem).
- *Sluneční zápalná tinktura* (olej na čepele způsobující ohnivé zranění).
- *Příručka 'Kladivo na kacíře'* (teologický spis obsahující indicie k slabinám kultu Kulla).

---

## Dialogy

### Pozdrav (první setkání)
```yaml
dialog_greeting:
  default: "Klidně si sedni, poutníku. Ale ne příliš blízko. Vzduch v tomhle zapadákově páchne hnilobou, potem a zatajovaným hříchem. Ty nevypadáš jako zdejší oráč... Což znamená, že buď před něčím utíkáš, nebo hledáš, komu prodat svou krev."
  if_flag_set:
    Q001_completed_A: "Viděl jsem starého mlynáře. Slzí štěstím a svírá zlatý kroužek. Hlupák... Netuší, že ten kov studí mrazem hrobu. Ty jsi mu ten prsten vrátil, že ano? Zvláštní, jak ochotně lidé pomáhají zakrývat stopy nečistých."
    Q001_completed_B: "Ten ubohý mlynář Boris se třese v koutě svého mlýna. Říká se, žes mu otevřel oči ohledně jeho milované Anny. Znalec pravdy... nebo krysa, co čmuchá v cizích tajemstvích? To se brzy ukáže."
    Q001_completed_C: "Stůj na místě. Necítíš to? Ten mrazivý pach spáleného stříbra a vlhké hlíny... Neseš na sobě pečeť Kulla, cizinče. Pokud ji nesmyješ ohněm, brzy tě pohltí."
    Q002_completed_A: "Plameny v kryptě vykonaly své dílo. Solarian vidí tvou poslušnost, poutníku. Mlynář bude podroben náležitému výslechu a Oakhaven bude čistý, i kdybychom ho měli prolít krví."
    Q002_completed_B: "Vrátil ses z ruin živý a tvrdíš, že tam byli jen potulní zloději... Možná ti věří ten opilý Aldric, ale mně nelži. Cítím, že něco z té krypty uniklo. A já na to přijdu."
    Q002_completed_C: "Tvé oči... jsou tmavší než dřív. V klášteře jsi cosi probudil, kacíři. Naše cesty se ještě zkříží – a příště nebude mluvit jazyk, nýbrž ocel a bílý oheň."
```

### Běžná konverzace
```yaml
dialog_topics:
  - topic: "O Solarianově inkvizici"
    text: "Lidé nám říkají řezníci, protože vypalujeme vředy dřív, než zabijí celé tělo. Teokracie nezná kompromis. Magie bez svěcení je nákaza a Probuzení bez řetězů je mor. Jednoho dne to pochopí i tenhle upadající císařský kraj."
  - topic: "O Anně a jejím tajemství"
    text: "Ta žena nepřišla do Oakhaven náhodou. Byla to přeběhlice z Tajemného Útočiště. Čarodějka, která si myslela, že zástěra a mouka na rukou smyjí její kacířskou krev. Když zemřela, její pečeť povolila. A stíny si přišly vybrat dluh."
  - topic: "O strážmistrovi Aldricovi"
    text: "Aldric je unavený starý pes, co raději předstírá spánek, než aby zaštěkal na vlka. Bojí se mě. Ví, že stačí jeden dopis do Sol-Sancta a do týdne tu stojí padesát mých bratří s pochodněmi."
  - topic: "O Ruinách kláštera"
    text: "Opatství svaté Judity bylo kdysi klenotem naší víry. Před sto lety ho však přepadli uctívači Kulla, mnichy zmasakrovali a v kryptách znesvětili oltář. Zdi jsou spálené, ale to nejhorší spí pod podlahou kaple."
    unlock_flag: "heard_about_monastery_lore"
  - topic: "O morálce a nevinnosti"
    text: "Místní mě proklínají. Říkají, že ta bylinkářka je nevinná. Ale nevinnost, poutníku, nechrání před nákazou. Když má soused na tváři morové vředy, ptáš se ho, jestli byl dobrý člověk, než mu dům zatlučeš prkny a zapálíš? Stín je duchovní mor. Já jsem jen lékárník, a oheň je můj skalpel."
```

### Quest dialog (Q002)
```yaml
dialog_quest:
  Q002:
    offer: "Potřebuji někoho, jehož smrt nezpůsobí církvi žádné papírování. V kryptách pod Ruinami kláštera se pohnul starý kult Kulla. Někdo tam manipuluje s pečetním kamenem stínů. Jdi tam, vyčisti tu havěť a přines mi Annin deník a relikvii. Odměním tě císařským zlatem a ochranou řádu."
    in_progress: "Krypta svaté Judity čeká, poutníku. Šepot stínů sílí s každým západem slunce. Neotálej, nebo začnu očistu přímo tady v městečku."
    complete_A: "Výborně. Relikvie shoří v posvátném plameni a Annin deník poslouží jako důkaz u soudu. Tady je tvá odměna. Oakhaven ti může děkovat... i když brzy potečou slzy."
    complete_B: "Přinášíš mi jen ohořelé cetky banditů a tvrdíš, že v kryptě nic nezbylo? Cítím lež na míle daleko. Vezmi si své stříbro a kliď se mi z očí, než si posvítím na tebe."
    complete_C: "Co jsi to udělal?! Vstřebal jsi ten kacířský jed do vlastní krve! Odstup ode mě, stvůro, než tě na místě probodnu posvěcenou ocelí!"
```
