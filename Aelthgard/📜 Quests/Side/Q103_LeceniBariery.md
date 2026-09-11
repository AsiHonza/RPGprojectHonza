---
title: "Q103 - Léčivý dech hvozdu"
tags: [quest, side, herbalism, healing, forest]
quest_id: "Q103"
type: side
giver_id: "bylinkarka_mira"
giver: "[[Bylinkářka Míra]]"
start_location_id: "oakhaven"
target_location_ids:
  - "dark_forest"
location: "[[Oakhaven]] ➔ [[Temný hvozd]]"
prerequisite_quests:
  - "Q004"
kingdom_id: 1
level_range: "3"
reward:
  gold: 25
  xp: 140
  items:
    - "Elixír čisté krve (léčí jedy, popáleniny a neutralizuje krystalické záření)"
    - "Bylinkářský křivák (zvyšuje výtěžnost sběru lesních surovin)"
  reputation:
    oakhaven: 10
    kmeny_z_hvozdu: 5
---

# Q103 – Léčivý dech hvozdu

> *"Městem se šíří popáleniny od modrého prachu a rány po kousnutí zmutovanou havětí hnisají černým hlenem. Běžné masti nezabírají. Potřebuji stříbřitý lišejník z padlých dubů v Hvozdu... ale sama se tam neodvážím ani na krok."*  
> — [[Bylinkářka Míra]]

---

## Přehled úkolu
Po nepokojích a prvních únicích aetheritových výparů v [[Q004_PecetAPlamen]] je špitál v Oakhaven plný sténajících raněných. Běžné byliny selhávají – krystalické toxiny vyžadují specifický protijed zvaný *Elixír čisté krve*.

K jeho uvaření potřebuje [[Bylinkářka Míra]] tři trsy *stříbřitého lišejníku*, který roste pouze na kmenech padlých dubů v bažinatých roklích [[Temný hvozd]].

---

## Fáze úkolu (Steps)

```yaml
steps:
  - id: 1
    objective: "Přijmi úkol od Bylinkářky Míry v její chýši u palisády"
    location_id: "oakhaven"
    trigger: "interact_npc:bylinkarka_mira"
    narrative: |
      Míra ti ukáže zraněného mladého strážného, jehož paže je poseta krystalickými pupeny. Prosí tě o pomoc dřív, než nákaza postoupí k srdci.
    on_complete_flag: "Q103_step1_done"

  - id: 2
    objective: "Najdi tři trsy stříbřitého lišejníku v Temném hvozdu"
    location_id: "dark_forest"
    trigger: "gathering_and_hazard"
    narrative: |
      V hluboké rokli u vyvráceného dubu nacházíš fosforeskující stříbřitý porost. Oblast však střeží hejno obřích lesních pijavic a močálové jedovaté spóry.
    on_complete_flag: "Q103_step2_done"

  - id: 3
    objective: "Vrať se k Míře a asistuj při destilaci lektvaru"
    location_id: "oakhaven"
    trigger: "crafting_interaction"
    narrative: |
      Společně s Mírou rozdrtíte lišejník v hmoždíři a destilujete čirou, chladivou tinkturu. Strážný po podání první dávky klidně usíná a krystaly z kůže opadávají.
    on_complete_flag: "Q103_step3_done"
```

## Odměna a dopad
- Hráč získává láhev *Elixíru čisté krve*, který je nepostradatelný při průzkumu zamořených pater v [[Q006_HlasyZPodzemi]].
- Obyvatelé Oakhaven tě vnímají jako zachránce raněných, což zlepší ceny u místních obchodníků.
