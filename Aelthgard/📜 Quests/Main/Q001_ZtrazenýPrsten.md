---
title: Q001 - Ztracený prsten
tags: [quest, main, prologue, oakhaven]
quest_id: Q001
type: main
giver_id: boris_mlynar
giver: "[[Boris Mlynář]]"
start_location_id: oakhaven
target_location_ids:
  - crossroads
location: "[[Oakhaven]] ➔ [[Stará křižovatka]]"
prerequisite_quests: []
prerequisite_flags: []
kingdom_id: 1
level_range: "1-3"
reward:
  gold: 25
  xp: 50
  items: ["Čerstvý bochník chleba"]
  reputation:
    valerijske_imperium: 2
---

# Q001 – Ztracený prsten

> *"Ten prsten byl to jediné, co mi po Anně zůstalo. Bez něj je to, jako by se její duše rozplynula v řece..."*  
> — [[Boris Mlynář]]

---

## Přehled úkolu
Zdánlivě banální venkovský úkol: [[Boris Mlynář]] v [[Oakhaven]] prosí nově příchozího hráče o nalezení zlatého snubního prstenu. Prsten mu údajně před dvěma dny sebrala skupinka banditů nebo goblinů, kteří drancovali u mlýnského náhonu a utekli směrem k [[Stará křižovatka]].

**Dějový zvrat (Fable/Witcher styl):**
Při vyšetřování hráč zjistí, že prsten není obyčejný rodinný šperk. Anna nebyla obyčejná venkovanka, ale ukrývající se Probuzená z [[Tajemné Útočiště]]. Do prstenu je vryta ochranná runa boha [[Religion#Kull|Kulla]]. Prsten nevzali náhodní zloději, ale zvědové, kteří po ní pátrali.

---

## Fáze úkolu (Steps)

```yaml
steps:
  - id: 1
    objective: "Promluv s Borisem Mlynářem u Starého mlýna"
    location_id: oakhaven
    trigger: "interact_npc:boris_mlynar"
    narrative: |
      Boris Mlynář tě oslovuje s prosbou v hlase. Vypráví o krádeži zlatého prstenu po své zesnulé ženě Anně. Během rozhovoru si všimneš, že voda v náhonu má nepřirozený modravý nádech a podlahová prkna mlýna se zničehonic nepatrně otřesou. Boris to ignoruje s tím, že "země je tu poslední dobou neklidná". Stopa vede na Starou křižovatku.
    on_complete_flag: "Q001_step1_done"

  - id: 2
    objective: "Vydej se na Starou křižovatku a prozkoumej opuštěný tábor"
    location_id: crossroads
    trigger: "explore"
    narrative: |
      Na Staré křižovatce nalézáš mezi křovím stopy po spěšném táboření. Popel je ještě vlažný. V blátě leží kožený váček a v něm... prsten. Když ho vezmeš do dlaně, prsty ti projede mrazivé brnění. Na vnitřní straně je vyrytá runa boha Kulla. Anna nebyla obyčejná vesničanka.
    on_complete_flag: "Q001_step2_done"

  - id: 3
    objective: "Rozhodni o osudu prstenu u Borise Mlynáře"
    location_id: oakhaven
    trigger: "branch_choice"
    narrative: |
      Stojíš znovu před Borisem. V kapse tě hřeje Annin prsten se záhadnou runou. Mlynář na tebe hledí plný naděje, zatímco klapající kolo mlýna dál rozráží nazelenale modrou vodu.
```

## Větvení a Morální Volby (Branches)

```yaml
branches:
  A:
    label: "Vrátit prsten a zachovat milosrdnou lež"
    narrative: |
      Podáváš Borisovi prsten a neříkáš nic o runě ani tajemství jeho ženy. Boris se rozpláče vděčností, tiskne šperk k hrudi a dává ti své úspory i čerstvý chléb. Odcházíš s čistým svědomím, ale tajemství zůstává pohřbeno.
    set_flags:
      - "Q001_completed_A"
      - "boris_grateful"
    reward:
      gold: 25
      xp: 50
      items: ["Čerstvý bochník chleba"]
    reputation_change:
      valerijske_imperium: 2
    unlock_quests: ["Q002"]
    world_event: "Boris Mlynář znovu nachází vůli žít. V Oakhaven se o tobě mluví jako o čestném poutníkovi."

  B:
    label: "Říct Borisovi pravdu o Anně a runě Kulla"
    narrative: |
      Ukazuješ Borisovi runu a vysvětluješ mu, že Anna byla Probuzená a někdo po ní šel. Boris je otřesen – svět, kterému věřil, se zhroutil. Po dlouhém mlčení však vytahuje rezavý klíč. 'Měla truhlu ve sklepě mlýna... Nikdy jsem ji nedokázal otevřít. Vezmi si to. Zasloužíš si vědět víc než já.'
    set_flags:
      - "Q001_completed_B"
      - "knows_anna_secret"
    reward:
      gold: 10
      xp: 75
      items: ["Klíč k Annině truhle"]
    unlock_quests: ["Q002_AnninaTruhla", "Q003_StopaTajemnehoUtociste"]
    world_event: "Odhalena existence sítě Tajemného Útočiště v pohraničí. Hráč získává přístup k tajnému archivu."

  C:
    label: "Prsten si nechat pro jeho skrytou magickou moc"
    narrative: |
      Lžeš Borisovi do očí – tvrdíš, že lupiči už byli pryč a prsten je ztracený. Boris se zlomí a beze slova se vrací do mlýna. Jakmile se dotkneš runy o samotě, cítíš, jak v tobě rezonuje zárodečné Probuzení...
    set_flags:
      - "Q001_completed_C"
      - "has_kull_ring"
      - "player_is_cynical"
    reward:
      gold: 0
      xp: 40
      items: ["Prsten boha Kulla (+1 slot kouzel, aura stínu)"]
    reputation_change:
      oakhaven: -5
      tajemne_utociste: 5
    unlock_quests: ["Q004_VyzvaStinu"]
    world_event: "V hráči procitá temnější aspekt Probuzení. Oakhavenští se na tebe dívají s podezřením."
```

---

## Vazby
- Zadavatel: [[Boris Mlynář]]
- Svědek: [[Strážmistr Aldric]] (odmítl úkol vyšetřovat)
- Místo vyvrcholení: [[Stará křižovatka]]
- Pokračování: Otevírá hlavní linii [[Act1_Oakhaven]] a stopy k [[Ruiny kláštera]].

