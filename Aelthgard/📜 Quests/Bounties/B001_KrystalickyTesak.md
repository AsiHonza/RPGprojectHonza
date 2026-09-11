---
title: "B001 - Zakázka: Krystalický tesák"
tags: [quest, bounty, hunting, wolves, oakhaven]
quest_id: "B001"
type: bounty
giver_id: "lovec_jarek"
giver: "[[Lovec Jarek]] (Vývěska zakázek)"
start_location_id: "oakhaven"
target_location_ids:
  - "crossroads"
location: "[[Oakhaven]] ➔ [[Atlas_Udoli_Oakhaven#📍-hex-12-severní-soutěska--cesta-k-falkenwachtu|Hex 12: Severní soutěska]]"
prerequisite_quests:
  - "Q003"
prerequisite_flags: []
kingdom_id: 1
level_range: "3"
reward:
  gold: 35
  xp: 120
  items:
    - "Trofej: Krystalická vlčí lebka (zavěsitelná na sedlo, budí respekt u lovců)"
    - "Lovecký olej proti divokým šelmám (zvyšuje poškození čepelí proti vlkům o 20 %)"
    - "Vlčí šlachy (surovina pro zesílení tětivy u Kováře Torbena)"
  reputation:
    oakhaven: 10
---

# B001 – Zakázka: Krystalický tesák

> *"Pár vlků z lesa, to je běžná věc, na to stačí vidle a pes. Ale tahle bestie ze soutěsky má hřbet pokrytej modrým sklem, tesáky jak dýky a když zaútočí, štípe koňský kosti jako suchý větvičky. Kdo přinese jeho hlavu, dostane 35 zlaťáků v hotovosti na ruku."*  
> — Leták přibitý na vývěsce u hostince U Zlomeného štítu

---

## Přehled zakázky
Zmutovaný alfa vlk přezdívaný dřevorubci **Krystalický tesák** terorizuje skalní soutěsku vedoucí na sever k Falkenwachtu. Vlk vede malou smečku tří krystalických mrchožroutů, přepadává vozy vezoucí dříví a zranil dva císařské posly.

[[Lovec Jarek]] v hostinci hráči poradí přesnou taktiku:
1. **Stopování:** Sledovat stopy krve a vyškrábané zářezy ve skalách v severní soutěsce.
2. **Návnada:** Vlk nesnáší hlad – stačí položit do rokle čerstvé skopové maso pomazané vlčím morem a borovicovým dehtem.
3. **Slabina:** Krystalické pláty na hřbetě odrážejí běžné seky; je třeba vlkova pozornost odvést pastí a bodat do měkkého břicha nebo do krčních cév pod čelistí.

---

## Fáze zakázky (Steps)

```yaml
steps:
  - id: 1
    objective: "Strhni leták z vývěsky a promluv s Lovcem Jarkem v krčmě"
    location_id: "oakhaven"
    trigger: "interact_npc:lovec_jarek"
    narrative: |
      Jarek dopíjí pivo a pokyvuje: 'Tesák je mazaná potvora. Číhá v jeskyni pod Čertovým zubem v soutěsce. Nelez tam ve dne, v poledním horku krystaly na jeho hřbetě žhnou a je vzteklej. Počkej na soumrak, polož návnadu a nachystej si ocelovou čelisťovou past.'
    on_complete_flag: "B001_step1_briefed"

  - id: 2
    objective: "Doraž do Severní soutěsky (Hex 12) a nastraž past s návnadou"
    location_id: "crossroads"
    trigger: "interact_trap_site"
    narrative: |
      Úzká břidlicová rokle je sevřená strmými skalami. Ve vzduchu visí zápach zkaženého masa. Mezi balvany leží ohlodaná kostra mezka.
      Hráč natahuje ocelovou past a na balvan pokládá krvavou návnadu. Vzápětí se ze skalního převisu ozve hluboké, rezonující zavytí.
    on_complete_flag: "B001_step2_trap_set"

  - id: 3
    objective: "Poraz Krystalického tesáka a jeho smečku"
    location_id: "crossroads"
    trigger: "combat_encounter"
    narrative: |
      Z horních skal seskočí obrovský černý vlk s azurově zářícíma očima. Jeho levá přední tlapa okamžitě zaklapne do ocelových čelistí pasti.
      Vlk zuří a prská jiskry. Zpoza kamenů vyrážejí dva mladší vlci. Boj je tvrdý – hráč musí dorazit smečku dřív, než se Tesák z pasti vyrve. Po přesném zásahu do hrdla se bestie s tichým zakňučením zhroutí.
    on_complete_flag: "B001_step3_beast_slain"

  - id: 4
    objective: "Uřízni trofej a vyzvedni odměnu u Lovce Jarka"
    location_id: "oakhaven"
    trigger: "interact_npc:lovec_jarek"
    narrative: |
      Lovec Jarek uznale potěžká krystalickou lebku a hodí na stůl kožený váček s 35 stříbrnými a zlatými mincemi:
      'Chlapsky odvedená práce. Tuhle lebku si pověs na opasek – až tě uvidí lapkové z lesa, dvakrát si rozmyslí, jestli na tebe vytáhnou rezavej nůž.'
    on_complete_flag: "B001_completed"
```

---

## 🎒 Odměna & Využití Trofeje
- **Trofej (Krystalická vlčí lebka):** Hmotná trofej, kterou může hráč nosit jako amulet nebo dekoraci. Poskytuje +5 k respektu u stráží a lovců.
- **Kovářské využití:** [Kovář Torben](file:///C:/Users/janml/.gemini/antigravity/RPGprojectHonza/Aelthgard/%F0%9F%91%A5%20Characters/NPCs/Kov%C3%A1%C5%99%20Torben.md) dokáže z vlkova nejdelšího krystalického tesáku vyrobit *Lovecký nůž s průrazným hrotem*.
