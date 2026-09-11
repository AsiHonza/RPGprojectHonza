---
title: Strážmistr Aldric
tags: [character, npc, guard, soldier, oakhaven]
npc_id: strazmistr_aldric
location_id: oakhaven
location: "[[Oakhaven]] – Strážnice"
gender: muz
type: quest-giver, autorita
disposition: neutral
faction_id: valerijske_imperium
quests:
  - Q101
trade_items: []
---

# Strážmistr Aldric

**Lokace:** [[Oakhaven]] – Strážnice  
**Typ:** Quest-giver, Místní autorita  
**Vztah k hráči:** Obezřetný / Přísný  

---

## Vzhled
Padesátiletý zjizvený muž se strništěm, oděný v obouchané zbroji z valerijské ocele. Na rameni nosí vybledlý plášť s císařským sluncem. Pravou nohu při chůzi mírně napadá – památka na válku v pohraničí.

## Osobnost
Cynický pragmatik. Už dávno ztratil iluze o cti rytířstva a spravedlnosti říše. Jeho jedinou prioritou je udržet město [[Oakhaven]] v celku a zbytečně neriskovat životy svých málo placených chlapů.

## Motivace
Udržet křehký pořádek ve městě, odrazit noční nájezdy goblinů z pole a nemuset žádat o posily z hlavního města, což by přitáhlo pozornost kruté císařské inkvizice.

## Questy
- [[Q101_GobliniFarma]] – zadavatel nebo sponzor odměny za vyčištění polí od goblinů.
- Spoluúčast v [[Q001_ZtrazenýPrsten]] (odmítá věc vyšetřovat jako malichernost).

## Vazby
- **[[Boris Mlynář]]:** Staří známí, Boris mu občas zdarma dodává pytel mouky pro strážnici, ale Aldric nemá čas řešit jeho ztracené cetky.
- **[[Valerijské Impérium]]:** Slouží mu přes 25 let, ale tajně opovrhuje zkorumpovanými úředníky.
- **[[Stará křižovatka]]:** Ví, že je tam nebezpečno, ale nemá dost lidí na hlídkování.

---

## Dialogy

### Pozdrav (první setkání)
```yaml
dialog_greeting:
  default: "Stůj, cizinče. V Oakhaven máme dost vlastních potíží a nepotřebujeme dalšího tuláka s mečem u pasu. Pokud jsi tu za obchodem, jdi do krčmy. Pokud hledáš trable, skončíš v šatlavě."
  if_flag_set:
    Q101_completed_A: "Á, podívejme se... lovec goblinů. Sedláci na severních polích už nebrečí a já se konečně vyspal. Dobrá práce."
    Q101_completed_B: "Sedláci říkají, že goblini utekli do hvozdu. Odvedl jsi svou práci, i když ne tak důkladně, jak bych čekal. Tady máš stříbro."
```

### Běžná konverzace
```yaml
dialog_topics:
  - topic: "O bezpečnosti města"
    text: "Mám dvanáct chlapů na celé město a dvě stě sáhů hradeb. Císařský dvůr posílá jen výběrčí daní, ale když žádám o posily, dělají, že neslyší. Každý den navíc bez krveprolití je pro mě vyhraná bitva."
  - topic: "O Borisi Mlynářovi"
    text: "Boris je dobrý chlap, ale žije v minulosti. Jeho žena Anna zemřela před rokem a on pořád hledá její prstýnek. Kdybych měl posílat stráže za každým ztraceným šperkem, kdo by hlídal brány před gobliny a bandity z křižovatky?"
  - topic: "O Temném hvozdu"
    text: "Tam nechoď. Les patří kmenům a divočině. Pokud tam vlezeš, nikdo tě hledat nepůjde. A ty elfí šípy nevarují předem."
  - topic: "O Inkvizitorovi Kaelenovi"
    text: "Ptáš se, proč ho prostě nevyženu? Víš, jak dlouho trvá, než sem dorazí císařská legie, když žádám o pomoc? Dva měsíce. Víš, jak dlouho trvá, než mě ten fanatik nechá upálit na náměstí? Pět minut. Nemám dost mužů na obranu města před zrůdami, natož abych válčil se Sol-Sanctem. Musíme ho jen přetrpět a nedat mu důvod k čistce."
```

### Quest dialog (Q101)
```yaml
dialog_quest:
  Q101:
    offer: "Hledáš práci? Sedlákům za hradbami někdo v noci podřezává dobytek a pálí stohy. Jsou to goblini z okraje Temného hvozdu. Zlikviduj je a přines mi důkaz. Vypíšu ti odměnu z městské pokladny – 15 stříbrňáků a dobrou loveckou dýku."
    in_progress: "Už jsi vyčistil ta pole? Každou noc, co čekáš, tratí sedláci další krávu."
    complete_A: "Vidím krev na tvé čepeli. Goblini se poučili. Tady je tvých 15 stříbrňáků a tahle vyvážená dýka z valerijské oceli. Zasloužil sis ji."
    complete_B: "Říkáš, že jsi je zahnal hluboko do lesa? Radši bych viděl jejich uši na provázku, ale klid na polích je klid. Tady máš odměnu."
```

