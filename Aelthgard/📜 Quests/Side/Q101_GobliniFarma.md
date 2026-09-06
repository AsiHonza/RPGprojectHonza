---
title: Q101 - Gobliní záškodníci
tags: [quest, side, combat, oakhaven]
quest_id: Q101
type: side
giver_id: strazmistr_aldric
giver: "[[Strážmistr Aldric]]"
start_location_id: oakhaven
target_location_ids:
  - dark_forest
location: "Předměstí [[Oakhaven]] ➔ [[Temný hvozd]]"
prerequisite_quests: []
prerequisite_flags: []
kingdom_id: 1
level_range: "1-3"
reward:
  gold: 15
  xp: 40
  items: ["Lovecká dýka"]
  reputation:
    valerijske_imperium: 3
---

# Q101 – Gobliní záškodníci

> *"Když ti potvory žerou zelí, je to k vzteku. Když ti podříznou krávu a zapálí stodolu, je čas chopit se sekery."*

---

## Přehled úkolu
Sedláci z předměstí [[Oakhaven]] hlásí nájezdy goblinů, kteří kradou dobytek a ničí úrodu. [[Strážmistr Aldric]] vypsal odměnu za vyčištění polí a vystopování jejich doupěte na okraji [[Temný hvozd]].

**Pozadí a hloubka (Witcher nádech):**
Goblini neutíkají do lesa z rozmaru – z hloubi [[Temný hvozd]] je vytlačilo něco mnohem horšího a hladovějšího (např. zmutované zvíře zasažené vlivem [[WorldRules#1. Magie a Probuzení|magického záření]] nebo šamani z [[Kmeny z hvozdů]]).

---

## Fáze úkolu (Steps)

```yaml
steps:
  - id: 1
    objective: "Přijmi zakázku od Strážmistra Aldrice v Oakhaven"
    location_id: oakhaven
    trigger: "interact_npc:strazmistr_aldric"
    narrative: |
      Strážmistr Aldric tě seznámí se situací na severních polích. Nabízí 15 stříbrňáků a armádní dýku za vyčištění gobliního hnízda.
    on_complete_flag: "Q101_step1_done"

  - id: 2
    objective: "Vystopuj gobliny k okraji Temného hvozdu"
    location_id: dark_forest
    trigger: "combat"
    narrative: |
      U paty vyvráceného dubu na okraji Temného hvozdu nacházíš provizorní brloh. Tři vyhladovělí goblini se na tebe vrhnou s rezavými srpy.
    on_complete_flag: "Q101_step2_done"

  - id: 3
    objective: "Prozkoumej doupě a učiň rozhodnutí"
    location_id: dark_forest
    trigger: "branch_choice"
    narrative: |
      Boj skončil. V hloubi kořenového doupěte se třesou dvě gobliní mláďata přikrčená u ohlodaných kostí. Na stěně z hlíny vidíš vyškrábané varování – kresbu obřího zvířete s rohy a modrýma očima. Goblini sem neutekli loupit, ale schovat se před něčím v hloubi hvozdu.
```

## Větvení a Morální Volby (Branches)

```yaml
branches:
  A:
    label: "Vyhladit doupě bez milosti a odnést trofeje Aldricovi"
    narrative: |
      Zakončuješ práci, za kterou jsi placený. Vracíš se k Aldricovi s uťatýma ušima jako důkazem. Aldric tě pochválí za chladnokrevnost a vyplácí plnou odměnu.
    set_flags:
      - "Q101_completed_A"
      - "merciless_slayer"
    reward:
      gold: 15
      xp: 45
      items: ["Lovecká dýka"]
    reputation_change:
      valerijske_imperium: 4
      kmeny_z_hvozdu: -3
    world_event: "Sedláci v Oakhaven oslavují konec gobliních nájezdů. V hloubi Temného hvozdu však cosi zlověstného zůstává nepovšimnuto."

  B:
    label: "Ušetřit přeživší a varovat je; Aldricovi říct, že jsou zahnáni"
    narrative: |
      Zasouváš zbraň do pochvy a ukazuješ goblinům, ať táhnou na západ. Berou si pár zbytků a mizí v křoví. Aldricovi nahlásíš, že doupě bylo vyčištěno a přeživší uprchli za řeku. Aldric ti zaplatí, ačkoliv brumlá, že radši vidí krev. V noci tě u táborového ohně navštíví šepot větru – bohyně Vyldia tvůj soucit zaznamenala.
    set_flags:
      - "Q101_completed_B"
      - "mercy_to_goblins"
      - "vyldia_favor"
    reward:
      gold: 10
      xp: 60
      items: ["Amulet z dubové kůry (+1 k přežití)"]
    reputation_change:
      valerijske_imperium: 1
      kmeny_z_hvozdu: 5
    unlock_quests: ["Q102_StinVHvozdu"]
    world_event: "Kmeny z hvozdů se dozvídají o cizinci, který nejedná jako běžní řezníci z Impéria."
```

