---
title: "Q105 - Znesvěcený háj"
tags: [quest, side, elves, wilderness, ritual]
quest_id: "Q105"
type: side
giver_id: "samanka_sylwen"
giver: "[[Šamanka Sylwen]]"
start_location_id: "elven_camp"
target_location_ids:
  - "dark_forest"
location: "[[Skrytý tábor elfů]] ➔ [[Temný hvozd]] (Posvátná mýtina)"
prerequisite_quests:
  - "Q005"
kingdom_id: 3
level_range: "4"
reward:
  gold: 35
  xp: 180
  items:
    - "Amulet zeleného jantaru (snižuje nepřátelství divokých zvířat v lesích)"
    - "Svazek posvátného jmelí Vyldie"
  reputation:
    kmeny_z_hvozdu: 20
---

# Q105 – Znesvěcený háj

> *"Na posvátném kameni mých předků vyrostl nádor z modrého skla. Každý pták, který nad ním přeletí, padá mrtev k zemi. Vyčisti ten kámen, člověče. Dokaž, že vaše ruce umí nejen ničit, ale i léčit."*  
> — [[Šamanka Sylwen]]

---

## Přehled úkolu
Po přijetí v táboře elfů v [[Q005_SepotVeVetvich]] požádá [[Šamanka Sylwen]] hráče o posvátnou zkoušku. Na starobylém menhiru zasvěceném bohyni [[Religion#Vyldia|Vyldii]] uprostřed [[Temný hvozd]] vyrašil agresivní aetheritový krystalický parazit. Vyzařuje vysokofrekvenční pulzy, které zraňují lesní duchy a otravují půdu.

Hráč musí menhir najít, porazit krystalem zmutovaného lesního medvěda a za pomoci bylinného rituálu parazitický krystal bezpečně odsekat a zničit.

---

## Fáze úkolu (Steps)

```yaml
steps:
  - id: 1
    objective: "Přijmi úkol od Šamanky Sylwen ve Skrytém táboře elfů"
    location_id: "elven_camp"
    trigger: "interact_npc:samanka_sylwen"
    narrative: |
      Sylwen ti potřísní čelo popelem a předá posvátné rituální dláto z rohoviny: 'Železo by kámen znesvětilo. Použij toto dláto a odřízni krystal u kořene.'
    on_complete_flag: "Q105_step1_done"

  - id: 2
    objective: "Najdi posvátnou mýtinu a poraz zmutovaného strážce"
    location_id: "dark_forest"
    trigger: "boss_combat"
    narrative: |
      Mýtina je tichá, tráva kolem kamene je zčernalá a zkřehlá. Ze křoví vyrazí obrovský jeskynní medvěd s hřbetem pokrytým azurovými krystaly.
    on_complete_flag: "Q105_step2_done"

  - id: 3
    objective: "Očisti rituální menhir rohovinovým dlátem"
    location_id: "dark_forest"
    trigger: "ritual_interaction"
    narrative: |
      Opatrně odsekáš pulzující krystal. Kámen vydechne teplou vlnu vůně jehličí a mechu. Zvětralé runy Vyldie se opět rozzáří měkkým zeleným světlem.
    on_complete_flag: "Q105_step3_done"

  - id: 4
    objective: "Vrať se k Sylwen do tábora pro požehnání klanu"
    location_id: "elven_camp"
    trigger: "interact_npc:samanka_sylwen"
    narrative: |
      Sylwen pokývne hlavou a pověsí ti na krk *Amulet zeleného jantaru*. Elfové v táboře tě nyní zdraví jako přítele lesa.
    on_complete_flag: "Q105_step4_done"
```
