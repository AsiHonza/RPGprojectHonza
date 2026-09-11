---
title: "Q108 - Prasečí osvícení sedláka Barnabáše"
tags: [quest, side, comedy, folklore, peasant, oakhaven]
quest_id: "Q108"
type: side
giver_id: "sedlak_barnabas"
giver: "[[Sedlák Barnabáš]]"
start_location_id: "oakhaven"
target_location_ids:
  - "oakhaven"
location: "Předměstí [[Oakhaven]] – Barnabášův statek za severní branou"
prerequisite_quests: []
prerequisite_flags: []
kingdom_id: 1
level_range: "1-2"
reward:
  gold: 30
  xp: 90
  items:
    - "Dědova jezdecká šavle valerijské jízdy (poctivá kovaná zbraň vytažená zpod chléva)"
    - "Aetheritový mezní kámen (starožitný hraničník se slabou modrou rezonancí)"
    - "Půlka uzeného boku od Barnabáše (vydatné jídlo obnovující energii)"
  reputation:
    oakhaven: 10
---
 vvvvvvvvvvvvvvvvvvvvvvvvcoi
# Q108 – Prasečí osvícení sedláka Barnabáše

> *"Sousede, přísahám na všechny svatý, že to zvíře na mě dneska ráno zahulákalo 'Nulla poena sine lege!' a odmítlo žrát čerstvý pomeje, dokud jsem mu je nenaservíroval na čistým prkně! Jestli to uslyší ten inkvizitorskej pes Kaelen, spálí mě i s chlévem a celou rodinou jako kacíře! Přijď se na něj podívat dřív, než Kryšpín sepíše odvolání k císařskýmu soudu!"*  
> — Sedlák Barnabáš, šeptající hráči do ucha za rohem kovárny

---

## Přehled úkolu
Sedlák Barnabáš z předměstí Oakhaven je na pokraji nervového zhroucení. Jeho nejlepší chovný kanec Kryšpín – třísetkilový zavalitý vepř – před třemi dny přestal chrochtat jako normální prase. Místo toho důstojně postává v rohu ohrady, zírá na lidi s povýšeným opovržením a vydává hrdelní zvuky nápadně připomínající latinské právnické fráze.

Vyděšený sedlák se bojí, že prase prodělalo kacířské [[WorldRules#1. Magie a Probuzení|Probuzení]] nebo že do něj vstoupil duch nenasytného výběrčího daní. Hráč se vydává do chlívku záhadu vyšetřit.

---

## Fáze úkolu (Steps)

```yaml
steps:
  - id: 1
    objective: "Doraž na Barnabášův statek za severní bránou a prohlédni kance Kryšpína"
    location_id: "oakhaven"
    trigger: "interact_pigpen"
    narrative: |
      Barnabáš vede hráče za stodolu. V chlívku v čisté slámě sedí obrovský strakatý kanec.
      Když se hráč přiblíží k ohradě, kanec se pomalu zvedne, zvedne rypák k nebi a s hlubokým zaduněním pronese: 'Hóóónorááácio! Prooo-tessst!'
      Barnabáš si v hrůze klekne na kolena a začne se křižovat sušenou klobásou.
    on_complete_flag: "Q108_step1_pig_examined"

  - id: 2
    objective: "Prozkoumej podlahu pod prasečím korytem"
    location_id: "oakhaven"
    trigger: "skill_investigation"
    narrative: |
      Hráč vleze do ohrady. Kanec se na něj dívá s aristokratickým klidem, ale neútočí.
      Hráč si všimne, že země v rohu pod dubovým korytem je čerstvě rozrytá. Z hlíny vyčnívá roh opracovaného kamenného bloku, který jemně, sotva znatelně pulzuje bledě modrým světlem.
    on_complete_flag: "Q108_step2_trough_checked"

  - id: 3
    objective: "Vykopej kámen z hlíny a odhal pravou příčinu záhady"
    location_id: "oakhaven"
    trigger: "interact_excavate_stone"
    narrative: |
      Hráč odhrabe rýčem hlínu a vytáhne třicetilibrový vápenec – prastarý Aetheritový mezní kámen císařské silnice.
      Kámen fungoval jako rezonanční akustická čočka: vnitřní dutina kamene zachytávala ozvěny z nedaleké soudní síně radnice a když prase foukalo rypákem do dutiny, kámen rezonoval a deformoval jeho chrochtání do podoby lidských slov!
      Jakmile je kámen z hlíny venku, Kryšpín radostně zakvičí, vrhne se do koryta s pomejemi a začne se spokojeně válet v blátě.
    on_complete_flag: "Q108_step3_stone_removed"

  - id: 4
    objective: "Prozkoumej jámu pod kamenem a najdi rodinný poklad"
    location_id: "oakhaven"
    trigger: "loot_barnabas_stash"
    narrative: |
      V jámě pod mezním kamenem však leží ještě něco: zrezivělá okovaná schránka.
      Barnabáš v úžasu zírá: 'To je dědova truhla z válek o pohraničí! Říkal, že ji schoval tam, kam by se žádnej výběrčí neodvážil strčit ruku... pod prasečí hnůj!'
      Uvnitř leží poctivá valerijská jezdecká šavle, kterou dědeček nosil v legii, a měšec s třiceti zlaťáky.
    on_complete_flag: "Q108_step4_treasure_found"

  - id: 5
    objective: "Převezmi odměnu od přešťastného sedláka"
    location_id: "oakhaven"
    trigger: "interact_npc:sedlak_barnabas"
    narrative: |
      Barnabáš skáče radostí, plácá Kryšpína po zádech a cpe hráči do náruče dědovu šavli, pytel mincí a půlku uzeného prasete:
      'Zachránil jsi mi krk, chlape! Kaelen nic nepozná a Kryšpín je zase poctivej, hloupej vepř! Šavli si nech, já jsem sedlák, mně stačí vidle a cep!'
    on_complete_flag: "Q108_completed"
```

---

## 🎒 Odměna & Využití
- **Dědova jezdecká šavle:** Rychlá sečná zbraň s lehkou čepelí a mosazným košem, ideální pro šermířské kryty.
- **Aetheritový mezní kámen:** Starobylý artefakt. [Učenec Fabian](file:///C:/Users/janml/.gemini/antigravity/RPGprojectHonza/Aelthgard/%F0%9F%91%A5%20Characters/NPCs/U%C4%8Denec%20Fabian.md) za něj zaplatí 25 zlatých nebo [Kovář Torben](file:///C:/Users/janml/.gemini/antigravity/RPGprojectHonza/Aelthgard/%F0%9F%91%A5%20Characters/NPCs/Kov%C3%A1%C5%99%20Torben.md) z něj vyjme stabilizační křemenné jádro pro zbraň.
