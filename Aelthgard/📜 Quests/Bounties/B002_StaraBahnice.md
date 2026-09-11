---
title: "B002 - Zakázka: Stará Bahnice"
tags: [quest, bounty, hunting, wetlands, reptile, oakhaven]
quest_id: "B002"
type: bounty
giver_id: "porybny_gorman"
giver: "[[Porybný Gorman]] (prostřednictvím vývěsky)"
start_location_id: "oakhaven"
target_location_ids:
  - "oakhaven"
location: "[[Atlas_Udoli_Oakhaven#📍-hex-02-dubová-blata--mrtvé-rameno-řeky-oak|Hex 02: Dubová blata]] – Mrtvé rameno řeky Oak"
prerequisite_quests: []
prerequisite_flags: []
kingdom_id: 1
level_range: "2-3"
reward:
  gold: 45
  xp: 140
  items:
    - "Trofej: Nepromokavá ještěří kůže (lze použít k ušití lehkého brnění)"
    - "Potopená jezdecká brašna (obsahuje 3 jablečné jantary a 25 císařských grošů)"
    - "Dóza bahenního tuku (odpuzuje komáry a pijavice)"
  reputation:
    oakhaven: 10
---

# B002 – Zakázka: Stará Bahnice

> *"Ta ještěří svině mi předevčírem stáhla pod vodu celou kozu i s uvazovacím kůlem! Má kůži jak dubový prkno, zuby jako pily a z tlamy jí páchne hnijícíma rybama tak, že by to porazilo i vola. Kdo ji propíchne a vytáhne na břeh, tomu dám půlku uzenýho jesetera a řeknu mu, kde v bahně leží utopená kupecká truhla!"*  
> — Vzkaz načmáraný uhlem na vývěsce, podepsaný Porybným Gormanem

---

## Přehled zakázky
V bažinatém mrtvém rameni řeky Oak (Hex 02: Dubová blata) se usadil obří dravý obojživelník přezdívaný **Stará Bahnice**. Třímetrový ropuchovitý plaz s pancéřovaným hřbetem a zubatým chřtánem napadá rybáře, decimuje stáda hus a zatahuje do tůní zvěř i neopatrné poutníky.

[[Porybný Gorman]] ve své chatrči u Černého rákosí hráči prozradí:
1. **Pohyb:** Bahnice se přes den schovává pod kořeny vyvrácených bahenních vrb v nejhlubší tůni.
2. **Vylákání:** Stačí do vody vhodit vnitřnosti s trochou kořalky – pach lihu a krve ji spolehlivě vytáhne na mělčinu.
3. **Slabina:** Pancíř na zádech neprorazí ani kuše; zranitelná je měkká bledá kůže na krku a citlivost očí na prudký oheň a zápalné pochodně.

---

## Fáze zakázky (Steps)

```yaml
steps:
  - id: 1
    objective: "Navštiv Porybného Gormana v chatrči u Černého rákosí (Hex 02)"
    location_id: "oakhaven"
    trigger: "interact_npc:porybny_gorman"
    narrative: |
      Gorman sedí na obráceném člunu a spravuje síť:
      'Bahnice číhá u třetí vrby za ostrůvkem. Tady máš pytel smradlavých rybích vnitřností. Hoď to do tůně, připrav si oštěp nebo pochodně a stůj na pevným břehu. Když tě stáhne do bahna, jsi mrtvej muž!'
    on_complete_flag: "B002_step1_gorman_briefed"

  - id: 2
    objective: "Doraž k Mrtvému rameni řeky a vhoď návnadu do hluboké tůně"
    location_id: "oakhaven"
    trigger: "interact_bait_water"
    narrative: |
      Hladina je pokrytá zeleným žabincem a kolem bzučí mračna velkých bahenních komárů.
      Hráč hodí návnadu do tmavé vody. O několik vteřin později se hladina rozestoupí a k hladině vystoupají obří bubliny páchnoucí sírou a bahnem.
    on_complete_flag: "B002_step2_bait_thrown"

  - id: 3
    objective: "Poraz Starou Bahnici v boji na břehu"
    location_id: "oakhaven"
    trigger: "combat_encounter"
    narrative: |
      Z vody se s mohutným zahučením vymrští obrovský ropuchovitý plaz s tělem posetým bradavicemi a krunýřem z říčního štěrku.
      Bestie útočí prudkým vymrštěním lepivého jazyka a snaží se hráče strhnout do hlubiny. Hráč musí využít pochodeň nebo zápalný šíp k oslepení zvířete a bodat do měkkého podhrdlí.
    on_complete_flag: "B002_step3_beast_slain"

  - id: 4
    objective: "Vyřízni z těla kůži a vyzvedni si odměnu u Gormana"
    location_id: "oakhaven"
    trigger: "interact_npc:porybny_gorman"
    narrative: |
      Gorman radostně bouchne dřevěnou nohou o molo:
      'Konečně je ta zubatice v pekle! Tady máš stříbro, co jsem ti slíbil. A tady ta brašna... vytáhl jsem ji zpod jejího doupěte ve vrbách. Nějakej císařskej jezdec tam před rokem zahučel i s koněm. Užij si to ve zdraví!'
    on_complete_flag: "B002_completed"
```

---

## 🎒 Odměna & Využití Trofeje
- **Trofej (Nepromokavá ještěří kůže):** Hladká, tuhá a voděodolná kůže. [Kovář Torben](file:///C:/Users/janml/.gemini/antigravity/RPGprojectHonza/Aelthgard/%F0%9F%91%A5%20Characters/NPCs/Kov%C3%A1%C5%99%20Torben.md) z ní dokáže vyrobit *Loveckou koženou kazajku močálníka* (zvyšuje odolnost vůči jedům a chladu).
- **Skrytý loot (Jezdecká brašna):** 3 leštěné jablečné jantary (prodejné u Fabiana za vysokou cenu) a 25 císařských grošů.
