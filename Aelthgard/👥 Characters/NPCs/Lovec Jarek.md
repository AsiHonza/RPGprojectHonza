---
title: Lovec Jarek
tags: [character, npc, hunter, trapper, bounties, oakhaven]
npc_id: lovec_jarek
location_id: oakhaven
location: "[[Oakhaven]] – [[Hostinec U Zlomeného štítu]] (stůl u vývěsky)"
gender: muz
type: quest-giver, trainer, merchant
disposition: friendly
faction_id: ""
quests:
  - B001
  - B002
  - B003
trade_items:
  - { name: "Ocelová čelisťová past na medvědy", type: "past", price: 12 }
  - { name: "Pachová návnada z kančí moči", type: "návnada", price: 4 }
  - { name: "Tuk proti krystalovým popáleninám", type: "lektvar", price: 8 }
  - { name: "Tvrzené šípy s křesadlovým hrotem", type: "munice", price: 6 }
---

# Lovec Jarek

> *"Netvor nezabíjí ze zlosti, chlapče. Zabíjí z hladu, ze strachu nebo proto, že mu do masa zarostl jedovatej šutr a třeští mu z toho hlava. Chceš-li bestii ulovit a nechat si kůži, neptej se kněze, jak se modlit. Zeptej se stopaře, z které strany vane vítr a jaký jed jí chutná."*  
> — Lovec Jarek, čistící ozubené čelisti staré železné pasti

---

## Vzhled
Šlachovitý padesátník s prošedivělými vlasy svázanými do copu a zjizvenou tváří od drápů lesní kočky. Nosí vyčiněný kožený kabát pobitý měděnými cvočky, vysoké lovecké holínky a na zádech těžkou reflexní kuši s kladkovým napínákem z Železného Prahu. U pasu mu cinká svazek železných ok a lahviček s pachovými oleji.

## Osobnost
Pragmatický, klidný a zkušený profesionál. Na rozdíl od pověrčivých vesničanů nevěří na démony – každá nestvůra má podle něj svaly, šlachy a slabé místo, které stačí proklát kalenou šipkou. Rád posedává u krbu v [[Hostinec U Zlomeného štítu|krčmě U Zlomeného štítu]], kde spravuje městskou **Vývěsku zakázek** a za korbel černého ležáku radí začínajícím lovcům.

## Motivace
Chce vyčistit okolí Oakhaven od nejnebezpečnějších zmutovaných predátorů dřív, než vtrhnou do městečka, a vydělat si na klidné stáří prodejem trofejí a kůží bohatým kupcům z Val-Aethelu.

## Lovecký Systém a Znalosti (Bounty Coordinator)
- **Správce Vývěsky:** Věší oficiální zakázky na lov bestií za odměnu od rychtáře i místních cechů.
- **Výuka slabin netvorů:** Hráči ochotně prozradí, jaké oleje, pasti a taktiky platí na krystalické vlky, bahenní ještěry i troglodyty.
- **Vykupování trofejí:** Platí zlatem a poctivou ocelí za donesené rohy, tesáky a šupiny unikátních zvířat.

## Questy
- Koordinátor loveckých zakázek: [[B001_KrystalickyTesak]], [[B002_StaraBahnice]], [[B003_SkalniDrvostep]].

---

## Dialogy

```yaml
dialog_greeting:
  default: "Buď zdráv, lovče. Jestli hledáš práci, kde teče krev a cinká zlato, podívej se na vývěsku u dveří. Místní rolníci brečí a platí slušný groše za každou useknutou hlavu."
  if_flag_set:
    bounty_completed_any: "Dobrá práce s tou potvorou! Vidím, že máš pevný prsty na tětivě. Tady máš svou odměnu a napij se se mnou ležáku."

dialog_topics:
  - topic: "Jak lovit krystalické bestie?"
    text: "Pamatuj si jedno: krystaly na jejich tělech fungují jako přirozený krunýř. Běžným mečem po nich jen sklouzneš a ztupíš čepel. Musíš mířit na břicho, vnitřní stranu stehen nebo týl pod lebkou. A hlavně – zvířata nakažená aetheritem nesnáší pach hořící síry a borovicového dehtu. Jedna zápalná šipka a začnou zběsile kvičet."
  - topic: "Co skrývá starý lom na vápence (Hex 03)?"
    text: "Předevčírem jsem tam stopoval jelena. V horní etáži lomu je zřícená kamenická huť. Pod deskou z bílého vápence tam starý lamač kamene nechal schovanou truhlu s tesanými acháty a těžkou palicí z kalené litiny. Ale bacha – v jámě pod tím se usadil obří troglodyt. Slyší i spadnutí šišky."
```
