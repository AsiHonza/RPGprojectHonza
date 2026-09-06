---
title: "{{title}}"
tags: [location]
node_id: "{{node_id}}"
type: mesto / divocina / dungeon / vesnice / poi
map_x: 0
map_y: 0
connections:
  - "[[Lokace_A]]"
  - "[[Lokace_B]]"
connections_ids:
  - "lokace_a_id"
  - "lokace_b_id"
faction_id: "{{faction_id}}"
kingdom_id: 1
npcs:
  - "npc_id_1"
quests:
  - "Q001"
---

# {{title}}

**Typ lokace:** {{type}}  
**Vládnoucí vliv / Frakce:** [[Frakce]]  
**Propojení s uzly:**
- [[Spojovací_Lokace_1]]
- [[Spojovací_Lokace_2]]

---

## Atmosféra a Vizuál
<!-- Smyslové vjemy: Co vidí, slyší a cítí návštěvník při vstupu. Tento text se použije jako base_description v JSON a zobrazí se hráči při příchodu. -->

## Body zájmu (Points of Interest)
- [[Důležitá_Budova_1]]
- [[Tajemné_Místo_2]]

## Přítomné Postavy (NPC)
- [[Postava_1]]
- [[Postava_2]]

## Události, Hrozby a Střetnutí
<!-- Náhodná setkání, počasí, nepřátelé, noční nebezpečí -->

## Tajemství a Skrytý Lore
<!-- Skryté chodby, zamčené truhly, zapomenuté nápisy na stěnách -->

## Příběh lokace
<!-- Jaký je hlavní motiv tohoto místa? Jaký problém tu existuje? Jak se toto místo pojí k okolním lokacím a k hlavní dějové linii? -->

## Nabízené akce při příchodu
<!-- Tyto akce se zobrazí hráči jako tlačítka po příchodu na lokaci -->
```yaml
default_actions:
  - "Prozkoumat okolí"
  - "Podívat se po lidech"
  - "Rozbít tábor"
```

## Random Encounters (pro offline i AI)
```yaml
encounters:
  - trigger: night
    chance: 0.3
    description: "Ze stínů se vynoří..."
    enemies: ["Vlk", "Vlk"]
  - trigger: enter
    chance: 0.15
    description: "Na cestě potkáváš..."
    type: social
```
