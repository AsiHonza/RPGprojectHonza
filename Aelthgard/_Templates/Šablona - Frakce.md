---
title: "{{title}}"
tags: [faction]
faction_id: "{{faction_id}}"
kingdom_id: 1
leader: "[[Jméno_Vůdce]]"
leader_npc_id: "{{npc_id}}"
capital: "[[Hlavní_Město]]"
capital_node_id: "{{node_id}}"
religion: "[[Náboženství]]"
attitude_towards_magic: tolerance / odpor / posvátné / pragmatické
attitude_towards_player: neutral
regions:
  - { node_id: "lokace_id", role: "hlavní město / vesnice / pevnost / svatyně" }
diplomatic_relations:
  - { faction_id: "jina_frakce", status: "spojenectvi / rivalita / valka / obchod / neutralni" }
---

# {{title}}

## Přehled a Identita
<!-- Historie, kultura, filozofie a postavení v Aelthgardu -->

## Vnitřní struktura a Velení
- **Vůdce:** [[Jméno_Vůdce]]
- **Důležité hodnosti a křídla:** ...

## Vztah k ostatním frakcím
- **[[Frakce_A]]:** Spojenectví / Válka / Obchod
- **[[Frakce_B]]:** ...

## Významné pevnosti a lokace
- [[Lokace_1]]
- [[Lokace_2]]

## Postoj k magii a Probuzení
<!-- Jak tato frakce reaguje na Probuzené a magii -->

## Motivy a Problémy
<!-- Jaké hlavní konflikty frakce má, co hledá, čeho se bojí -->
<!-- Toto čte AI i quest generátor jako zdroj motivací pro questy v rámci království -->

## Questové linie v rámci království
```yaml
quest_chains:
  - chain_id: "chain_{{faction_id}}_01"
    name: "Název questové linie"
    description: "Krátký popis řetězce úkolů"
    quests: ["Q201", "Q202", "Q203"]
    theme: "politika / válka / záhada / přežití"
```
