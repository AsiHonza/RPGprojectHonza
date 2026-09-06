---
title: "{{title}}"
tags: [quest]
quest_id: "Q..."
type: main / side / faction
giver_id: "{{npc_id}}"
giver: "[[Zadavatel_NPC]]"
start_location_id: "{{location_node_id}}"
target_location_ids:
  - "{{target_node_id}}"
location: "[[Výchozí_Lokace]] ➔ [[Cílová_Lokace]]"
prerequisite_quests: []
prerequisite_flags: []
kingdom_id: 1
level_range: "1-5"
reward:
  gold: 0
  xp: 0
  items: []
  reputation: {}
---

# {{title}}

> *"Krátká atmosféru navozující citace nebo úryvek dialogu zadavatele."*

---

## Přehled úkolu
<!-- Proč úkol vznikl, jaká je situace ve světě, skrytý háček / zvrat -->

## Zúčastněné postavy & vazby
- **Zadavatel:** [[NPC]]
- **Oponent / Cíl:** [[NPC]]
- **Dotčené lokace:** [[Lokace]]

---

## Fáze úkolu (Steps)

```yaml
steps:
  - id: 1
    objective: "Popis cíle pro hráče"
    location_id: "{{node_id}}"
    trigger: "interact_npc:{{npc_id}}"
    narrative: |
      Text vypravěče pro tuto fázi (pro offline verzi).
      Může být víceřádkový a atmosférický.
    on_complete_flag: "Q{{quest_id}}_step1_done"

  - id: 2
    objective: "Druhý krok"
    location_id: "{{node_id}}"
    trigger: "explore / combat / interact_npc:{{npc_id}} / interact_poi:{{poi_id}}"
    narrative: |
      Text vypravěče pro druhou fázi.

  - id: 3
    objective: "Klíčové rozhodnutí"
    trigger: "branch_choice"
    narrative: |
      Hráč stojí před dilematem...
```

## Větvení a Morální Volby (Branches)

```yaml
branches:
  A:
    label: "Popis volby A (zobrazí se hráči)"
    narrative: |
      Co se stane při výběru varianty A.
      Atmosférický popis následků.
    set_flags:
      - "Q{{quest_id}}_completed_A"
      - "{{jiný_flag}}"
    clear_flags: []
    reward:
      gold: 25
      xp: 50
      items: ["Název předmětu"]
    reputation_change:
      "faction_id": 5
    unlock_quests: ["Q002"]
    lock_quests: ["Q003"]
    npc_disposition_change:
      "npc_id": "friendly"
    world_event: "Popis toho, jak se změní svět (pro AI kontext)"

  B:
    label: "Popis volby B"
    narrative: |
      Co se stane při výběru varianty B.
    set_flags:
      - "Q{{quest_id}}_completed_B"
    reward:
      gold: 10
      xp: 75
      items: ["Jiný předmět"]
    reputation_change:
      "faction_id": -3
    unlock_quests: ["Q003"]
    lock_quests: ["Q002"]
    world_event: "Jiná změna ve světě"

  C:
    label: "Popis volby C (temná/morálně šedá)"
    narrative: |
      Co se stane při výběru varianty C.
    set_flags:
      - "Q{{quest_id}}_completed_C"
      - "player_is_ruthless"
    reward:
      gold: 50
      xp: 30
    reputation_change:
      "oakhaven": -10
    world_event: "Drastická změna"
```

---

## Decision Flags Reference
<!-- 
Tato sekce dokumentuje vlajky (flags), které tento quest NASTAVUJE a ČTOU.
Slouží jako reference pro navazující questy a agenty.

NASTAVUJE:
- Q{{quest_id}}_completed_A / B / C  (vždy jedna z variant)
- Q{{quest_id}}_step1_done, _step2_done (průběh)

ČTOU (prerequisite_flags):
- Žádné (tento quest je vstupní)
  nebo
- Q001_completed_A  (tento quest se aktivuje jen pokud hráč vybral variantu A v Q001)
-->

## Následky volby v herním světě
<!-- Jak splnění nebo selhání úkolu změní stav lokací a postoje NPC. 
Toto čte AI jako world context a offline verze jako state mutations. -->
