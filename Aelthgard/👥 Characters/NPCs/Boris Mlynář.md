---
title: Boris Mlynář
tags: [character, npc, merchant, questgiver, oakhaven]
npc_id: boris_mlynar
location_id: oakhaven
location: "[[Oakhaven]] – [[Starý mlýn]]"
gender: muz
type: quest-giver, merchant
disposition: friendly
faction_id: ""
quests:
  - Q001
trade_items:
  - { name: "Ovesné placky", type: "jídlo", price: 2 }
  - { name: "Sušená jablka", type: "jídlo", price: 1 }
  - { name: "Pytel obilí", type: "surovina", price: 3 }
---

# Boris Mlynář

**Lokace:** [[Oakhaven]] – [[Starý mlýn]]  
**Typ:** Quest-giver, Merchant  
**Vztah k hráči:** Přátelský  

---

## Vzhled
Korpulentní muž v padesátce s moukou v prošedivělých vousech a vlasech. Nosí zapranou lněnou košili a koženou zástěru, na které je patrné mnohaleté opotřebení. V očích má stálý unavený smutek.

## Osobnost
Tiše trpí, vyhýbá se konfliktům a snaží se nevyvolávat problémy s městskou gardou ani s výběrčími daní. Když se však napije medoviny v [[Hostinec U Zlomeného štítu|krčmě]], rozhovoří se o své zesnulé ženě Anně.

## Motivace
Chce za každou cenu získat zpět zlatý prsten po své ženě. Je to jediná hmatatelná vzpomínka, kterou po ní má. Bojí se, že pokud prsten skončí v rukou zlodějů nebo goblinů, zapomene i na její tvář.

## Questy
- [[Q001_ZtrazenýPrsten]] – primární quest-giver (zadává hráči úkol vypátrat prsten).

## Vazby
- **[[Strážmistr Aldric]]:** Přátelský vztah z mládí, ačkoliv Aldric jeho trápení s prstenem považuje za zbytečnou sentimentální hloupost v těžkých časech.
- **[[Stará křižovatka]]:** Podezřívá, že bandité na křižovatce mají prsty v krádeži.
- **Znalost:** Ví o zvěstech o gobliních doupatech v [[Temný hvozd]].

## Obchodní inventář
- Pytle s moukou, ovesné placky, sušené jablka, pytel obilí na návnadu.

---

## Dialogy

### Pozdrav (první setkání)
```yaml
dialog_greeting:
  default: "Vítej, poutníku... Promiň ten nepořádek. Od té doby, co odešla Anna, mlýn jen tiše chátrá. Hledáš mouku, nebo jen přístřeší před deštěm?"
  if_flag_set:
    Q001_completed_A: "Á, příteli! Pokaždé, když ten prsten sevřu v dlani, cítím, jako by Anna stála vedle mě. Děkuji ti z celého srdce."
    Q001_completed_B: "Vítej... Pořád přemýšlím o tom, co jsi mi řekl o Anně. O té runě... Celá léta jsem žil vedle někoho, koho jsem vlastně neznal. Přesto ti děkuji za pravdu."
    Q001_completed_C: "Ty... Prsten jsi nenašel, viď? Cítím v kostech, že mi něco tajíš. Prosím, nech mě o samotě s mým žalem."
```

### Běžná konverzace
```yaml
dialog_topics:
  - topic: "O mlýně"
    text: "Tenhle mlýn postavil můj praděd. Dřív sem jezdili sedláci z celého kraje. Dnes? Pole pustoší havěť a císařská daňová komora bere i poslední pytel otrub."
  - topic: "O Anně"
    text: "Byla to nejtišší a nejlaskavější žena v celém Oakhaven. Nikdy nemluvila o své rodině ani odkud přišla. Jen ten prsten... nosila ho na stříbrném řetízku na krku a nikdy ho nesundala."
  - topic: "O strážmistrovi Aldricovi"
    text: "Aldric je starý pes. Sloužili jsme spolu v pohraničí, když jsme byli mladí. Je zatrpklý a vidí jen hrozby a čísla, ale město drží pohromadě."
```

### Quest dialog (Q001)
```yaml
dialog_quest:
  Q001:
    offer: "Poutníku... Vidím, že nosíš zbraň a nebojíš se cesty. Před dvěma dny mi lupiči vyplenili komoru a sebrali Annin prsten. Utekli ke Staré křižovatce. Aldric mi nepomůže. Přines mi ho zpět, zaplatím ti vším, co mi zbývá!"
    in_progress: "Už jsi byl na Staré křižovatce? Prosím, pospěš si, než ten prsten překupníci odvezou do Svobodných měst."
    complete_A: "Můj bože... to je on! Vracíš mi mou duši. Tady, vezmi si těchto 25 zlaťáků a pecen čerstvého chleba. Oakhaven ti nikdy nezapomene tuto laskavost!"
    complete_B: "Cože to říkáš? Magická runa Kulla? Tajemné Útočiště?! Anna... byla Probuzená čarodějka?! Proč mi to nikdy neřekla... Vezmi si tenhle klíč. Patřil jí. Odemkne truhlu pod podlahou, kterou jsem nikdy nedokázal otevřít."
```

