---
title: "Q104 - Poslední zásilka z hlubin"
tags: [quest, side, dungeon, mine, memorial]
quest_id: "Q104"
type: side
giver_id: "kovar_torben"
giver: "[[Kovář Torben]]"
start_location_id: "oakhaven"
target_location_ids:
  - "abandoned_mine"
location: "[[Oakhaven]] ➔ [[Opuštěný důl]]"
prerequisite_quests:
  - "Q006"
kingdom_id: 6
level_range: "3-4"
reward:
  gold: 40
  xp: 160
  items:
    - "Cechovní tesák předáka ze Železného Prahu (vysoce odolná ocelová zbraň)"
    - "Dopis na rozloučenou pro rodiny horníků"
  reputation:
    zelezny_prah: 15
    oakhaven: 10
---

# Q104 – Poslední zásilka z hlubin

> *"Když se před půl rokem zřítila východní štola, zůstalo tam pět mých tovaryšů. Vím, že už nedýchají. Ale jejich rodiny ve městě dodnes čekají na zázrak. Chci, abys jim přinesl jejich cechovní známky a vzkazy. Zaslouží si vědět pravdu."*  
> — [[Kovář Torben]]

---

## Přehled úkolu
Během průzkumu 1. patra dolu v [[Q006_HlasyZPodzemi]] se otevřela cesta do zatopeného východního křídla. [[Kovář Torben]] hráče požádá o citlivou misi: nalézt ostatky pěti zavalených horníků ze [[Železný Práh]], posbírat jejich mosazné cechovní známky a vyzvednout plechovou schránku s dopisy, kterou horníci před smrtí uložili do suché skalní pukliny.

---

## Fáze úkolu (Steps)

```yaml
steps:
  - id: 1
    objective: "Přijmi úkol od Kováře Torbena v jeho kovárně"
    location_id: "oakhaven"
    trigger: "interact_npc:kovar_torben"
    narrative: |
      Torben ti předá náčrt východního křídla a klíč od skříňky cechovního dozorce. V hlase se mu mísí smutek a vztek: 'Císařští úředníci na ně zapomněli druhý den po závalu. My z Železného Prahu nezapomínáme nikdy.'
    on_complete_flag: "Q104_step1_done"

  - id: 2
    objective: "Pronikni do zatopené východní štoly v Opuštěném dole"
    location_id: "abandoned_mine"
    trigger: "exploration_and_puzzle"
    narrative: |
      Voda sahá po kolena a páchne tlejícím dřevem. Musíš přebrodit zatopený úsek, odvalit uvolněné balvany a zneškodnit jeskynní mrchožrouty hodující na starých zbytcích.
    on_complete_flag: "Q104_step2_done"

  - id: 3
    objective: "Najdi ostatky horníků a vyzvedni plechovou schránku s dopisy"
    location_id: "abandoned_mine"
    trigger: "item_pickup"
    narrative: |
      U zborceného pilíře nacházíš kostry pěti mužů, kteří se choulili k sobě. V puklině nad nimi leží neporušená plechová krabička s vyrytým znakem Železného Prahu.
    on_complete_flag: "Q104_step3_done"

  - id: 4
    objective: "Vrať se k Torbenovi a předej památky pozůstalým"
    location_id: "oakhaven"
    trigger: "emotional_resolution"
    narrative: |
      Torben se slzami v očích přebírá známky. Společně navštívíte vdovy a sirotky v chudinské čtvrti Oakhaven. Zármutek je hluboký, ale rodiny konečně nacházejí klid a Torben ti z vděčnosti věnuje kovanou zbraň předáka.
    on_complete_flag: "Q104_step4_done"
```
