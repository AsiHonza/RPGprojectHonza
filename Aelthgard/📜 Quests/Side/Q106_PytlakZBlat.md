---
title: "Q106 - Ztracený sumec porybného Gormana"
tags: [quest, side, comedy, fishing, wetlands, oakhaven]
quest_id: "Q106"
type: side
giver_id: "porybny_gorman"
giver: "[[Porybný Gorman]]"
start_location_id: "oakhaven"
target_location_ids:
  - "oakhaven"
location: "[[Atlas_Udoli_Oakhaven#📍-hex-02-dubová-blata--mrtvé-rameno-řeky-oak|Hex 02: Dubová blata]] – Mrtvé rameno řeky Oak"
prerequisite_quests: []
prerequisite_flags: []
kingdom_id: 1
level_range: "1-2"
reward:
  gold: 20
  xp: 80
  items:
    - "Gormanův starý rybářský prut z tisového proutí (zvyšuje šanci na úlovek v minihře)"
    - "Gormanův rodinný stříbrný prsten (vyrytý erb říčního cechu)"
    - "Plechovka vyzrálých bahenních červů"
  reputation:
    oakhaven: 5
---

# Q106 – Ztracený sumec porybného Gormana

> *"Říkají mi, že jsem starej blázen, co chlastá trnkovici a plete si kapra se slonem! Ale já vám přísahám na Solariana, že ten sumec měl v hubě můj stříbrnej prsten a ještě na mě mrknul svým zakaleným okem! Vytáhněte ho z vody a ten prsten si klidně nechte... chci vidět jenom jeho vyuzenou tlamu!"*  
> — Gorman, mlátící dřevěnou nohou do prázdného kádě na ryby

---

## Přehled úkolu
Starý porybný Gorman ztratil před třemi dny svůj rodinný stříbrný pečetní prsten. Tvrdí, že mu ho z prstu při stahování sítí spolkl legendární pětisáhový sumec zvaný "Starý Fousáč". Hostinský Odo i strážmistr Aldric se Gormanovi smějí a tvrdí, že porybný prsten jednoduše propil v krčmě nebo upustil do kádě se slepýši.

Hráč se vydává do rákosí s rybářským náčiním, aby záhadu vyřešil. Úkol kombinuje humorné vesnické rybaření s lehkým hororovým zvratem – sumec v blatech doopravdy žije, ale je zčásti zmutovaný kapkami aetheritové mízy stékající z horního toku řeky!

---

## Fáze úkolu (Steps)

```yaml
steps:
  - id: 1
    objective: "Vyslechni Gormanův opilecký nářek v rybářské chýši u Černého rákosí"
    location_id: "oakhaven"
    trigger: "interact_npc:porybny_gorman"
    narrative: |
      Gorman sedí na stoličce s lahví trnkovice a vzlyká:
      'Můj děda ten prsten nosil padesát let! Vyryl do něj heslo našeho cechu: 'Kdo nespí, ten chytí'. A teď ho v žaludku tráví ta slizká říční obluda! Vem si můj prut a tuhle plechovku naložených bahenních larev a jdi na konec starýho mola!'
    on_complete_flag: "Q106_step1_gorman_briefed"

  - id: 2
    objective: "Zasedni na molo v Mrtvém rameni a nahoď udici (Rybářská minihra)"
    location_id: "oakhaven"
    trigger: "fishing_minigame"
    narrative: |
      Hráč usedá na konec ztrouchnivělého prkna nad kalnou černou hladinu. Kolem poletují vážky a bzučí komáři.
      Hráč nahodí splávek z husího brku. Po chvíli napětí brk prudce poskočí:
      1. První záběr: Stará zablácená bota s dírou na palec.
      2. Druhý záběr: Vzteklá vodní užovka, která se pokusí hráče kousnout do ruky.
      3. Třetí záběr: Šňůra se napne jako struna a prut z tisového proutí se ohne do půlkruhu!
    on_complete_flag: "Q106_step2_fish_hooked"

  - id: 3
    objective: "Vytáhni Starého Fousáče z vody a získej prsten"
    location_id: "oakhaven"
    trigger: "combat_or_athletics"
    narrative: |
      Z vody vyletí gigantický, dvoumetrový šedivý sumec s dlouhými vousy a fosforeskujícíma modrýma očima. Zvíře sebou divoce hází po molu a snaží se hráče srazit do hlubiny.
      Hráč rybu zpacifikuje úderem vesla. Po vyříznutí žaludku uvnitř nachází:
      - Ztracený stříbrný prsten porybného.
      - Tři zrezivělé měděné mince.
      - Mosaznou sponu z císařského opasku (důkaz dávno utopeného vojáka).
    on_complete_flag: "Q106_step3_ring_recovered"

  - id: 4
    objective: "Vrať se za Gormanem a učiň rozhodnutí o prstenu"
    location_id: "oakhaven"
    trigger: "interact_npc:porybny_gorman"
    narrative: |
      Když Gorman uvidí obří rybí hlavu na prkně a lesknoucí se prsten, vyhrknou mu slzy do očí a padne hráči kolem krku:
      'Já to věděl! Já nebyl blázen! Ten prsten... a ta ryba! Dneska bude na břehu taková rybí polévka, jakou Oakhaven ještě nezažilo!'
    on_complete_flag: "Q106_completed"
```

---

## ⚖️ Morální Rozuzlení
- **Vrácení prstenu Gormanovi:** Gorman je neskonale vděčný, dá hráči svůj mistrovský rybářský prut a prozradí mu polohu potopeného pašeráckého sudu plného kořalky pod vrbovými kořeny.
- **Ponechání prstenu jako odměny:** Hráč může Gormana přesvědčit, že prsten potřebuje jako talisman na cesty. Gorman neochotně souhlasí, pokud dostane sumčí maso a láhev trnkovice.
