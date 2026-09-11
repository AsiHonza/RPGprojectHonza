---
title: Sedlák Barnabáš
tags: [character, npc, farmer, peasant, comedy, oakhaven]
npc_id: sedlak_barnabas
location_id: oakhaven
location: "Předměstí [[Oakhaven]] – Barnabášův grunt za severní branou"
gender: muz
type: quest-giver, farmer
disposition: friendly
faction_id: ""
quests:
  - Q108
trade_items:
  - { name: "Hrouda uzeného sádla", type: "jídlo", price: 2 }
  - { name: "Kvašené nakládané zelí v soudku", type: "jídlo", price: 3 }
  - { name: "Pytel sušených žaludů a hrachu", type: "krmivo", price: 1 }
  - { name: "Dřevěné vidle s kovanými hroty", type: "zbraň/nářadí", price: 5 }
---

# Sedlák Barnabáš

> *"Povídám vám, sousede, to prase není normální vepř! Včera v noci jsem ho načapal v chlívku, jak si rypákem kreslí do hnoje geometrický trojúhelníky a chrochtá v císařský právnický latině! A když jsem napřáhl řeznickej tesák, podívalo se to zvíře na mě tak přísně, jako kdybych dlužil na daních za poslední tři roky! Já ho zabít nemůžu, co když je to převtělenej arcibiskup?!"*  
> — Barnabáš, stojící před chlívkem s dřevěnou palicí a svěcenou vodou

---

## Vzhled
Zavalitý, zarudlý sedlák s mohutným břichem, které mu přetéká přes kalhoty z hrubého plátna stažené provazem. Má plešatou hlavu lemovanou chomáči šedivých vlasů, husté huňaté obočí a ruce jako lopaty, věčně špinavé od hlíny a hnoje. Kolem krku mu visí tři různé talismany proti uřknutí – zaječí packa, sušená česneková hlavička a křivý měděný sluneční křížek.

## Osobnost
Bodrý, pověrčivý a k smrti vyděšený venkovan. Věří na všechno od vodníků přes noční můry až po mluvící kozy. Rád si stěžuje na počasí, na sucho, na přílišné deště a na to, že jeho žena Božena mu nedovolí pít pivo před polednem. Přesto má dobré srdce a své čeledíny i dobytek by nikdy zbytečně netrápil.

## Motivace
Chce vyřešit záhadu kolem svého obřího kance Kryšpína. Má strach, že pokud se o mluvícím praseti dozví Inkvizitor Kaelen, nechá spálit celý jeho statek i s úrodou jako semeniště ďábelské magie.

## Znalosti a Drby o Údolí
- **Zahrabaný sud pálenky u mlýna:** Barnabáš ví, kde Borisův děda zakopal v roce velkého krupobití třicetilitrový dubový soudek čistého obilného lihu, aby ho nenašli císařští vojáci.
- **Lesní včelíny pod skalami:** Zná tajné místo v lesní strži, kde v dutinách starých lip hnízdí divoké lesní včely produkující vzácný černý med, který léčí plicní kašel.

## Questy
- [[Q108_PraseciOsviceni]] – zadavatel humorného venkovského úkolu o osvíceném praseti a podzemním aetheritovém kameni.

---

## Dialogy

```yaml
dialog_greeting:
  default: "Pst! Mluv potichu, chlape! Nekřič tak, Kryšpín v chlívě právě spí a když se vzbudí mrzutej, začne rypákem odříkávat císařský daňový sazby na pšenici a z toho mi jde hlava kolem!"
  if_flag_set:
    Q108_completed: "Panečku, ty jsi borec! Kdybys ten zakletej modrej šutr zpod jeho koryta nevytáhl, už jsme dneska s Boženou seděli v šatlavě pro kacíře. Kryšpín už zase normálně žere šrot a prdí do slámy jako každej slušnej valerijskej pašík! Tady máš šrůtku uzenýho boku!"

dialog_topics:
  - topic: "Co přesně to prase dělá?"
    text: "Před tejdnem ryl v rohu ohrady a vyhrabal takovej divnej plochej šutr, co ve tmě modře světélkoval. Od tý chvíle nežere pomeje! Strká do mě rypákem a vydává zvuky jako: 'Apelááácio! Kontribúúúcio!' Já tomu nerozumím, já do školy nechodil! Soused povídal, že je to duch starýho rychtářova dědka, co tu před třiceti lety zdefraudoval obecní sýpku!"
  - topic: "Neprodáš nějaké zásoby?"
    text: "Mám tu poctivý uzený sádlo z loňský zabijačky a soudek kyselýho zelí. Nic lepšího na posilnění po celodenním mlácení mečem nenajdeš!"
```
