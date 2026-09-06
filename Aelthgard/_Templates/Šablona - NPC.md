---
title: "{{title}}"
tags: [character, npc]
npc_id: "{{npc_id}}"
location_id: "{{location_node_id}}"
location: "[[{{location}}]]"
gender: muz / zena
type: quest-giver / merchant / guard / neutral / companion
disposition: friendly / neutral / hostile / fearful
faction_id: "{{faction_id}}"
quests:
  - "Q001"
trade_items:
  - { name: "Název", type: "zbraň/zbroj/lektvar/jídlo/surovina/cennost", price: 10 }
---

# {{title}}

**Lokace:** [[{{location}}]]  
**Typ:** {{type}}  
**Vztah k hráči:** {{disposition}}  

---

## Vzhled
<!-- Popis tělesné stavby, věku, oblečení, jizev, výrazu -->

## Osobnost
<!-- Jak mluví, jak jedná pod tlakem, slabosti, zvláštnosti, manýry -->

## Motivace & Cíle
<!-- Co postava chce, čeho se bojí, co skrývá -->

## Questy
- [[Quest_Nazev]] – role postavy v úkolu

## Vazby a vztahy
- **[[Jiná_Postava]]:** Vztah k této postavě
- **[[Frakce]]:** Postoj k organizaci či království
- **[[Lokace]]:** Osobní vazba k místu

## Inventář / Nabídka (volitelné)
- Zboží na prodej nebo unikátní předmět, který lze získat/ukrást

---

## Dialogy

### Pozdrav (první setkání)
```yaml
dialog_greeting:
  default: "Řeč při prvním setkání s hráčem."
  if_flag_set:
    Q001_completed_A: "Reakce pokud hráč splnil quest variantou A."
    Q001_completed_B: "Reakce pokud hráč splnil quest variantou B."
```

### Běžná konverzace
```yaml
dialog_topics:
  - topic: "O sobě"
    text: "Co NPC řekne o svém životě."
  - topic: "O okolí"
    text: "Co NPC ví o lokálních událostech."
  - topic: "Zvěsti"
    text: "Drby, narážky na questy nebo skryté informace."
    unlock_flag: "heard_rumor_{{npc_id}}"
  - topic: "O {{jiné_npc}}"
    text: "Co si NPC myslí o jiné postavě."
    requires_flag: "met_{{jiné_npc_id}}"
```

### Quest dialog
```yaml
dialog_quest:
  Q001:
    offer: "Text nabídky questu."
    in_progress: "Text když je quest aktivní."
    complete_A: "Reakce na variantu A splnění."
    complete_B: "Reakce na variantu B splnění."
    failed: "Reakce na selhání."
```
