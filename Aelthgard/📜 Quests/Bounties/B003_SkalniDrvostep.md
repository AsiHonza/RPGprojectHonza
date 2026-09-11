---
title: "B003 - Zakázka: Skalní drvoštěp"
tags: [quest, bounty, hunting, quarry, troglodyte, oakhaven]
quest_id: "B003"
type: bounty
giver_id: "kovar_torben"
giver: "[[Kovář Torben]] (Vývěska zakázek)"
start_location_id: "oakhaven"
target_location_ids:
  - "old_mine"
location: "[[Atlas_Udoli_Oakhaven#📍-hex-03-vápencové-lomy--kamenická-huť|Hex 03: Vápencové lomy]] – Zpustlá kamenická huť"
prerequisite_quests:
  - "Q004"
prerequisite_flags: []
kingdom_id: 1
level_range: "3-4"
reward:
  gold: 50
  xp: 160
  items:
    - "Trofej: Obří žulová palice se železnými skobami (masivní dvouruční drtivá zbraň)"
    - "Lamačská křemenná truhla (obsahuje 4 ocelové ingoty a drahokam horského křišťálu)"
    - "Cechovní uznání Železného Prahu"
  reputation:
    zelezny_prah: 15
    oakhaven: 10
---

# B003 – Zakázka: Skalní drvoštěp

> *"V opuštěným vápencovým lomu se usadil vyvrženej troglodyt velkej jak stodola. Říkají mu Skalní drvoštěp, protože si z otesanýho trámu a žulovýho balvanu udělal palici a mlátí s ní do skály, až padá kamení na přístupovou cestu. Kováři potřebujou vápenec na tavení oceli! Kdo toho slepýho obra pošle pod kytky, dostane padesát zlaťáků z cechovní kasy."*  
> — Zakázkový list s pečetí cechu kovářů Železného Prahu

---

## Přehled zakázky
V opuštěných vápencových lomech (Hex 03 na západě údolí) se usadil obrovský, třímetrový zmutovaný podzemní troglodyt – **Skalní drvoštěp**. Zvíře je zcela slepé následkem života v jeskyních, avšak disponuje abnormálně vyvinutým sluchem a čichem. Každý krok nebo cinknutí kovu v lomu přiláká jeho pozornost a obr zaútočí svou žulovou palicí.

[[Kovář Torben]] hráči vysvětlí loveckou taktiku:
1. **Lokalizace:** Drvoštěp přebývá v hluboké jámě pod zřícenou kamenickou hutí.
2. **Akustická finta:** Vzhledem k jeho slepotě ho lze snadno zmást hlukem – stačí házet kameny na protější břidlicové desky a donutit ho útočit do prázdna.
3. **Slabina:** Nohy a šlachy v podkolenních jamkách; jakmile obr padne na kolena pod tíhou vlastní palice, jeho nechráněný krk je snadným cílem.

---

## Fáze zakázky (Steps)

```yaml
steps:
  - id: 1
    objective: "Přijmi zakázku u Kováře Torbena a vyzvedni si hlukové petardy"
    location_id: "oakhaven_forge"
    trigger: "interact_npc:kovar_torben"
    narrative: |
      Torben podává hráči dvě malé hliněné kuličky se střelným prachem:
      'Tohle mu bouchne u uší jako hromobití. Drvoštěp nevidí ani na krok, ale slyší tlukot tvýho srdce na dvacet sáhů. Zmátni ho zvukem a rozsekej mu achilovky.'
    on_complete_flag: "B003_step1_torben_briefed"

  - id: 2
    objective: "Vstup do Vápencového lomu (Hex 03) a najdi doupě v kamenické huti"
    location_id: "old_mine"
    trigger: "location_arrival"
    narrative: |
      Bílé vápencové stěny lomu se tyčí do výšky. Všude leží hromady bílého štěrku a polámané dřevěné jeřáby.
      Ze dna lomu se ozývá hluboké hrdelní bručení a pravidelné dunění – obr žulovou palicí drtí kusy vápence na prach.
    on_complete_flag: "B003_step2_quarry_entered"

  - id: 3
    objective: "Poraz Skalního drvoštěpa za pomoci hlukové taktiky"
    location_id: "old_mine"
    trigger: "combat_boss"
    narrative: |
      Hráč hodí petardu na protější skálu. Hromový záblesk obra zcela rozzuří – zařve a slepě udeří palicí do kamenného bloku, do kterého se jeho zbraň hluboce zasekne.
      Hráč má několik vteřin na útok zezadu. Boj vyžaduje neustálý pohyb a tichý krok. Po přetnutí šlach se titán skácí do vápencového prachu.
    on_complete_flag: "B003_step3_boss_slain"

  - id: 4
    objective: "Vyzvedni skrytý poklad v kamenické huti a přines trofej Torbenovi"
    location_id: "oakhaven_forge"
    trigger: "interact_npc:kovar_torben"
    narrative: |
      Pod podlahou zřícené huti nachází hráč zanechanou truhlu lamačů kamene plnou těžkých ocelových ingotů a křišťálů.
      V kovárně v Oakhaven Torben převezme zuby obra a s úsměvem položí na kovadlinu slíbenou odměnu 50 zlatých.
    on_complete_flag: "B003_completed"
```

---

## 🎒 Odměna & Využití Trofeje
- **Trofej (Žulová palice drvoštěpa):** Obrovské obouruční kladivo (vyžaduje sílu), způsobující masivní omračující zranění a snadno prorážející štíty.
- **Cechovní ocel:** 4 ocelové ingoty z truhly lze využít u Torbena k bezplatnému vylepšení libovolné zbraně či zbroje na úroveň *Mistrovské dílo*.
