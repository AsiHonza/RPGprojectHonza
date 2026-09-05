// Definice talentových stromů pro všech 12 D&D tříd
// Každá třída obsahuje 5 aktivních schopností a 5 pasivních schopností

export type SkillType = 'active' | 'passive';
export type SkillTargetType = 'single' | 'aoe' | 'self';
export type StatusEffectType = 'burning' | 'bleeding' | 'poisoned' | 'frozen' | 'stunned' | 'shielded';

export interface SkillRankData {
  rank: number;
  cost: number; // 1, 2, nebo 3
  desc: string;
  milestonePerk?: string;
  damageDice?: string;
  damageBonus?: number;
  healAmount?: number;
  shieldAmount?: number;
  statusEffect?: {
    type: StatusEffectType;
    duration: number;
    damagePerRound?: number;
    chance?: number;
  };
}

export interface ClassSkill {
  id: string;
  name: string;
  class: string;
  type: SkillType;
  iconName: string;
  apCost?: number;
  cooldown?: number;
  targetType?: SkillTargetType;
  ranks: SkillRankData[];
}

export interface ClassSkillTree {
  className: string;
  description: string;
  primaryStat: 'str' | 'dex' | 'con' | 'intel' | 'wis' | 'cha';
  skills: ClassSkill[];
}

export const CLASS_SKILL_TREES: Record<string, ClassSkillTree> = {
  "Barbar": {
    className: "Barbar",
    description: "Nezkrotný válečník ovládaný hněvem, který absorbuje drtivé poškození a drtí nepřátele surovou silou.",
    primaryStat: "str",
    skills: [
      // 5 Aktivních
      {
        id: "barbar_rage",
        name: "Zuřivost (Rage)",
        class: "Barbar",
        type: "active",
        iconName: "Flame",
        apCost: 1,
        cooldown: 3,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Vstoupíš do zuřivosti: získáš +3 k fyzickému poškození a snižuješ utržené zranění o 30 % na 2 kola." },
          { rank: 2, cost: 2, desc: "Zuřivost poskytuje +6 k poškození a -50 % utrženého fyzického poškození na 2 kola." },
          { rank: 3, cost: 3, desc: "Zuřivost poskytuje +10 k poškození a -50 % poškození na 3 kola.", milestonePerk: "Milník: Po dobu trvání zuřivosti jsi zcela imunní vůči Omráčení a Zchlazení." }
        ]
      },
      {
        id: "barbar_reckless",
        name: "Drtivý úder (Reckless Strike)",
        class: "Barbar",
        type: "active",
        iconName: "Swords",
        apCost: 2,
        cooldown: 1,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Brutální rána: udělí 1d10 + síla poškození a způsobí Krvácení (3 dmg/kolo, 2 kola).", damageDice: "1d10", statusEffect: { type: "bleeding", duration: 2, damagePerRound: 3 } },
          { rank: 2, cost: 2, desc: "Udělí 2d8 + síla poškození a způsobí hluboké Krvácení (5 dmg/kolo, 3 kola).", damageDice: "2d8", statusEffect: { type: "bleeding", duration: 3, damagePerRound: 5 } },
          { rank: 3, cost: 3, desc: "Udělí 2d10 + síla poškození s krvácením.", damageDice: "2d10", statusEffect: { type: "bleeding", duration: 3, damagePerRound: 6 }, milestonePerk: "Milník: Pokud cíl již krvácel, tento úder ho na 1 kolo omráčí." }
        ]
      },
      {
        id: "barbar_battle_cry",
        name: "Válečný řev (Battle Cry)",
        class: "Barbar",
        type: "active",
        iconName: "Zap",
        apCost: 1,
        cooldown: 2,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "Zastrašíš nepřátele: všichni mají -2 k hodu na útok na 2 kola." },
          { rank: 2, cost: 2, desc: "Všichni nepřátelé mají -3 k hodu na útok a -1 k AC na 2 kola." },
          { rank: 3, cost: 3, desc: "Všichni nepřátelé mají -4 k útoku a ztratí 1 AP v dalším kole.", milestonePerk: "Milník: Zastrašení udělí všem nepřátelům 6 psychického poškození." }
        ]
      },
      {
        id: "barbar_ground_slam",
        name: "Zemětřesný dup (Ground Slam)",
        class: "Barbar",
        type: "active",
        iconName: "Activity",
        apCost: 2,
        cooldown: 3,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Drtivý úder do země zasáhne všechny nepřátele za 1d6 + síla poškození.", damageDice: "1d6" },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 1d8 + síla poškození a shodí nepřátele (-2 AC na 2 kola).", damageDice: "1d8" },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 2d6 + síla poškození všem nepřátelům.", damageDice: "2d6", milestonePerk: "Milník: Poškodí zbroj nepřátel (-3 AC trvale do konce boje)." }
        ]
      },
      {
        id: "barbar_bloodlust",
        name: "Krvavá lázeň (Bloodlust)",
        class: "Barbar",
        type: "active",
        iconName: "Skull",
        apCost: 2,
        cooldown: 2,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Dravý úder za 1d12 + síla poškození. Pokud cíl zabije, obnoví 15 HP.", damageDice: "1d12" },
          { rank: 2, cost: 2, desc: "Udělí 2d8 + síla poškození. Pokud cíl zabije, obnoví 25 HP a 1 AP.", damageDice: "2d8" },
          { rank: 3, cost: 3, desc: "Udělí 2d12 + síla poškození.", damageDice: "2d12", milestonePerk: "Milník: Zabití cíle okamžitě resetuje cooldown všech barbarových schopností." }
        ]
      },
      // 5 Pasivních
      {
        id: "barbar_unarmored_defense",
        name: "Nespoutaná obrana",
        class: "Barbar",
        type: "passive",
        iconName: "Shield",
        ranks: [
          { rank: 1, cost: 1, desc: "Získáváš +2 k AC a +5 k maximálnímu zdraví." },
          { rank: 2, cost: 2, desc: "Získáváš +3 k AC a +12 k maximálnímu zdraví." },
          { rank: 3, cost: 3, desc: "Získáváš +4 k AC a +20 k maximálnímu zdraví.", milestonePerk: "Milník: Plná imunita vůči krvácení." }
        ]
      },
      {
        id: "barbar_frenzy_rush",
        name: "Frenetický spěch",
        class: "Barbar",
        type: "passive",
        iconName: "Zap",
        ranks: [
          { rank: 1, cost: 1, desc: "Začínáš každý boj s +1 AP v prvním kole." },
          { rank: 2, cost: 2, desc: "Začínáš každý boj s +1 AP a máš +2 k iniciativě." },
          { rank: 3, cost: 3, desc: "Začínáš boj s +1 AP a iniciativou.", milestonePerk: "Milník: Každé zabití nepřítele má 35% šanci okamžitě vrátit 1 AP." }
        ]
      },
      {
        id: "barbar_pain_tolerance",
        name: "Odolnost vůči bolesti",
        class: "Barbar",
        type: "passive",
        iconName: "HeartHandshake",
        ranks: [
          { rank: 1, cost: 1, desc: "Plochá redukce veškerého utrženého zranění o 1." },
          { rank: 2, cost: 2, desc: "Plochá redukce veškerého utrženého zranění o 2." },
          { rank: 3, cost: 3, desc: "Plochá redukce veškerého utrženého zranění o 3.", milestonePerk: "Milník: Poškození z DoT efektů (oheň, jed, krev) je sníženo o 50 %." }
        ]
      },
      {
        id: "barbar_battle_instincts",
        name: "Bojové instinkty",
        class: "Barbar",
        type: "passive",
        iconName: "Target",
        ranks: [
          { rank: 1, cost: 1, desc: "Pokud máš pod 50 % HP, tvé útoky mají o 10 % vyšší šanci na kritický zásah." },
          { rank: 2, cost: 2, desc: "Pokud máš pod 50 % HP, máš o 20 % vyšší šanci na kritický zásah a +2 AC." },
          { rank: 3, cost: 3, desc: "Zvýšená šance na kritický zásah pod 50 % HP.", milestonePerk: "Milník: Kritické zásahy v zuřivosti udělují trojnásobné poškození namísto dvojnásobného." }
        ]
      },
      {
        id: "barbar_relentless_rage",
        name: "Neutuchající hněv",
        class: "Barbar",
        type: "passive",
        iconName: "ShieldAlert",
        ranks: [
          { rank: 1, cost: 1, desc: "Pokud by tvé HP kleslo na 0, jednou za boj přežiješ s 1 HP." },
          { rank: 2, cost: 2, desc: "Při záchraně před smrtí přežiješ s 15 % maximálních HP." },
          { rank: 3, cost: 3, desc: "Při záchraně před smrtí přežiješ s 25 % HP.", milestonePerk: "Milník: Záchrana před smrtí okamžitě aktivuje Zuřivost na 2 kola a omráčí nejbližšího nepřítele." }
        ]
      }
    ]
  },

  "Kouzelník": {
    className: "Kouzelník",
    description: "Učený mistr arkánních sil, který studiem svitků ovládá zničující živly a manipulační bariéry.",
    primaryStat: "intel",
    skills: [
      {
        id: "wiz_magic_missile",
        name: "Magická střela (Magic Missile)",
        class: "Kouzelník",
        type: "active",
        iconName: "Sparkles",
        apCost: 1,
        cooldown: 0,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Vypálí naváděnou střelu za 1d4 + 2 poškození. Vždy zasáhne (ignoruje AC).", damageDice: "1d4", damageBonus: 2 },
          { rank: 2, cost: 2, desc: "Vypálí 2 střely, každou za 1d4 + 2 poškození (celkem 2d4 + 4).", damageDice: "2d4", damageBonus: 4 },
          { rank: 3, cost: 3, desc: "Vypálí 3 střely za celkem 3d4 + 6 poškození.", damageDice: "3d4", damageBonus: 6, milestonePerk: "Milník: Střely oslabí magickou odolnost cíle (+20 % k poškození příštím kouzlem)." }
        ]
      },
      {
        id: "wiz_fireball",
        name: "Ohnivá koule (Fireball)",
        class: "Kouzelník",
        type: "active",
        iconName: "Flame",
        apCost: 2,
        cooldown: 2,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Vrhne ohnivou kouli na všechny nepřátele za 1d8 + intel poškození a zapálí je (🔥 Hoření 3 dmg/kolo, 2 kola).", damageDice: "1d8", statusEffect: { type: "burning", duration: 2, damagePerRound: 3 } },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 2d6 + intel poškození a způsobí Hoření (5 dmg/kolo, 2 kola).", damageDice: "2d6", statusEffect: { type: "burning", duration: 2, damagePerRound: 5 } },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 2d8 + intel poškození všem.", damageDice: "2d8", statusEffect: { type: "burning", duration: 3, damagePerRound: 6 }, milestonePerk: "Milník: Cíle, které uhoří na DoT, explodují a způsobí 8 plamenného poškození ostatním." }
        ]
      },
      {
        id: "wiz_ray_of_frost",
        name: "Mrazivý paprsek (Ray of Frost)",
        class: "Kouzelník",
        type: "active",
        iconName: "Wind",
        apCost: 1,
        cooldown: 1,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Ledový paprsek za 1d8 + intel poškození; cíl je Zchlazen (❄️ -1 AP v dalším tahu).", damageDice: "1d8", statusEffect: { type: "frozen", duration: 1 } },
          { rank: 2, cost: 2, desc: "Udělí 1d10 + intel poškození; cíl má -1 AP a -2 AC na 1 kolo.", damageDice: "1d10", statusEffect: { type: "frozen", duration: 1 } },
          { rank: 3, cost: 3, desc: "Udělí 2d8 + intel poškození chladem.", damageDice: "2d8", statusEffect: { type: "frozen", duration: 1 }, milestonePerk: "Milník: 50% šance na úplné Zmrazení cíle (vynechá celé kolo)." }
        ]
      },
      {
        id: "wiz_shield",
        name: "Magický štít (Shield)",
        class: "Kouzelník",
        type: "active",
        iconName: "Shield",
        apCost: 1,
        cooldown: 2,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Okamžitě vyvolá bariéru: +4 AC do konce příštího kola.", shieldAmount: 10 },
          { rank: 2, cost: 2, desc: "Vyvolá bariéru: +5 AC a absorpční štít na 15 HP.", shieldAmount: 15 },
          { rank: 3, cost: 3, desc: "Vyvolá bariéru: +6 AC a štít na 25 HP.", shieldAmount: 25, milestonePerk: "Milník: Odráží 50 % zablokovaného poškození zpět útočníkovi." }
        ]
      },
      {
        id: "wiz_chain_lightning",
        name: "Bleskový řetěz (Chain Lightning)",
        class: "Kouzelník",
        type: "active",
        iconName: "Zap",
        apCost: 3,
        cooldown: 3,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Blesk přeskočí na všechny nepřátele za 2d6 + intel bleskového poškození.", damageDice: "2d6" },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 2d8 + intel poškození a má 30% šanci omráčit hlavní cíl (💫).", damageDice: "2d8" },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 3d8 + intel poškození všem.", damageDice: "3d8", milestonePerk: "Milník: 50% šance na omráčení VŠECH zasažených nepřátel." }
        ]
      },
      // 5 Pasivních
      {
        id: "wiz_mystic_study",
        name: "Mystická učenost",
        class: "Kouzelník",
        type: "passive",
        iconName: "BookOpen",
        ranks: [
          { rank: 1, cost: 1, desc: "Všechna kouzla udělují o +2 poškození navíc." },
          { rank: 2, cost: 2, desc: "Všechna kouzla udělují o +4 poškození navíc." },
          { rank: 3, cost: 3, desc: "Všechna kouzla udělují o +6 poškození navíc.", milestonePerk: "Milník: Kouzla ignorují 50 % elementálních odolností nepřítele." }
        ]
      },
      {
        id: "wiz_elemental_focus",
        name: "Elementální rezonance",
        class: "Kouzelník",
        type: "passive",
        iconName: "Flame",
        ranks: [
          { rank: 1, cost: 1, desc: "Ohnivá a ledová kouzla mají o 10 % vyšší šanci na aplikaci statusu." },
          { rank: 2, cost: 2, desc: "Statusy z kouzel mají o 25 % vyšší šanci a trvají o 1 kolo déle." },
          { rank: 3, cost: 3, desc: "Vylepšené status efekty kouzel.", milestonePerk: "Milník: Poškození DoT efektem Hoření je zvýšeno o 50 %." }
        ]
      },
      {
        id: "wiz_arcane_recovery",
        name: "Arkánová zásoba",
        class: "Kouzelník",
        type: "passive",
        iconName: "Sparkles",
        ranks: [
          { rank: 1, cost: 1, desc: "Při seslání kouzla máš 15% šanci na okamžité vrácení 1 AP." },
          { rank: 2, cost: 2, desc: "Při seslání kouzla máš 25% šanci na vrácení 1 AP." },
          { rank: 3, cost: 3, desc: "35% šance na vrácení 1 AP při seslání kouzla.", milestonePerk: "Milník: Zabití nepřítele kouzlem garantuje vrácení 1 AP." }
        ]
      },
      {
        id: "wiz_fast_casting",
        name: "Rychlé soustředění",
        class: "Kouzelník",
        type: "passive",
        iconName: "Zap",
        ranks: [
          { rank: 1, cost: 1, desc: "Všechny cooldowny schopností delší než 2 kola jsou zkráceny o 1 kolo na začátku boje." },
          { rank: 2, cost: 2, desc: "Trvalé zkrácení cooldownu Ohnivé koule o 1 kolo." },
          { rank: 3, cost: 3, desc: "Trvalé zkrácení všech cooldownů o 1 kolo (min. 1).", milestonePerk: "Milník: Jednou za boj můžeš vyresetovat cooldown jednoho libovolného kouzla." }
        ]
      },
      {
        id: "wiz_mirror_image",
        name: "Zrcadlový obraz",
        class: "Kouzelník",
        type: "passive",
        iconName: "Eye",
        ranks: [
          { rank: 1, cost: 1, desc: "První útok nepřátel v každém boji má 50% šanci, že zasáhne iluzi a mine." },
          { rank: 2, cost: 2, desc: "První útok nepřítele v každém boji VŽDY mine (garantovaná iluze)." },
          { rank: 3, cost: 3, desc: "Garantovaný úhyb z prvního útoku.", milestonePerk: "Milník: Zničení iluze oslepí útočníka (-3 k útoku na 2 kola)." }
        ]
      }
    ]
  },

  "Tulák": {
    className: "Tulák",
    description: "Mistr plížení, zákeřných úderů ze zálohy, jedů a bleskových úniků.",
    primaryStat: "dex",
    skills: [
      {
        id: "rogue_sneak_attack",
        name: "Zákeřný útok (Sneak Attack)",
        class: "Tulák",
        type: "active",
        iconName: "Swords",
        apCost: 1,
        cooldown: 1,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Úder ze stínu za 1d8 + obratnost poškození. Pokud cíl trpí statusem, udělí +1d6 extra.", damageDice: "1d8" },
          { rank: 2, cost: 2, desc: "Udělí 2d6 + obratnost poškození. Na oslabený cíl udělí +2d6 extra.", damageDice: "2d6" },
          { rank: 3, cost: 3, desc: "Udělí 2d8 + obratnost poškození.", damageDice: "2d8", milestonePerk: "Milník: Úder zcela ignoruje zbroj cíle (AC = 0) a garantuje kritický zásah na krvácející terč." }
        ]
      },
      {
        id: "rogue_shadowstep",
        name: "Stínový krok (Shadowstep)",
        class: "Tulák",
        type: "active",
        iconName: "Zap",
        apCost: 1,
        cooldown: 2,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Splyneš se stíny: získáš +4 AC a tvůj příští útok má výhodu (+3 k hodu na zásah)." },
          { rank: 2, cost: 2, desc: "Získáš +5 AC a tvůj příští útok má 100% šanci na kritický zásah." },
          { rank: 3, cost: 3, desc: "+6 AC a garantovaný kritický zásah.", milestonePerk: "Milník: Okamžitě odstraní z tuláka veškeré negativní DoT stavy a debuffy." }
        ]
      },
      {
        id: "rogue_poison_blade",
        name: "Otrávená čepel (Poison Blade)",
        class: "Tulák",
        type: "active",
        iconName: "Droplets",
        apCost: 1,
        cooldown: 2,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Bodnutí za 1d6 + obratnost; cíl je Otráven (🧪 Otrava 3 dmg/kolo, 2 kola, -2 k útoku).", damageDice: "1d6", statusEffect: { type: "poisoned", duration: 2, damagePerRound: 3 } },
          { rank: 2, cost: 2, desc: "Udělí 1d8 poškození a způsobí silnou Otravu (5 dmg/kolo na 3 kola).", damageDice: "1d8", statusEffect: { type: "poisoned", duration: 3, damagePerRound: 5 } },
          { rank: 3, cost: 3, desc: "Udělí 2d6 poškození jedem.", damageDice: "2d6", statusEffect: { type: "poisoned", duration: 3, damagePerRound: 6 }, milestonePerk: "Milník: Jed sníží způsobované poškození nepřítele o 35 %." }
        ]
      },
      {
        id: "rogue_fan_of_knives",
        name: "Vrh dýkami (Fan of Knives)",
        class: "Tulák",
        type: "active",
        iconName: "Crosshair",
        apCost: 2,
        cooldown: 2,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Vymrští vějíř dýk na všechny nepřátele za 1d6 + obratnost a způsobí Krvácení (🩸 3 dmg/kolo, 2 kola).", damageDice: "1d6", statusEffect: { type: "bleeding", duration: 2, damagePerRound: 3 } },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 1d8 + obratnost poškození a 50% šanci na krvácení všem.", damageDice: "1d8", statusEffect: { type: "bleeding", duration: 2, damagePerRound: 4 } },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 2d6 + obratnost poškození všem.", damageDice: "2d6", statusEffect: { type: "bleeding", duration: 3, damagePerRound: 5 }, milestonePerk: "Milník: Každý krvácející nepřítel zasažený touto salvou vrátí tulákovi 1 AP." }
        ]
      },
      {
        id: "rogue_assassinate",
        name: "Průraz tepny (Assassinate)",
        class: "Tulák",
        type: "active",
        iconName: "Skull",
        apCost: 3,
        cooldown: 3,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Smrtící poprava: udělí 2d10 + obratnost poškození.", damageDice: "2d10" },
          { rank: 2, cost: 2, desc: "Udělí 3d10 + obratnost poškození. Pokud cíl krvácí, udělí +10 poškození.", damageDice: "3d10" },
          { rank: 3, cost: 3, desc: "Udělí 4d10 + obratnost poškození.", damageDice: "4d10", milestonePerk: "Milník: Pokud má cíl méně než 30 % HP, tento útok ho okamžitě usmrtí." }
        ]
      },
      // 5 Pasivních
      {
        id: "rogue_nimble",
        name: "Mrštnost",
        class: "Tulák",
        type: "passive",
        iconName: "Shield",
        ranks: [
          { rank: 1, cost: 1, desc: "Při nošení lehkého brnění získáváš +2 k AC." },
          { rank: 2, cost: 2, desc: "Při nošení lehkého brnění získáváš +3 k AC a +2 k iniciativě." },
          { rank: 3, cost: 3, desc: "+4 k AC a +3 k iniciativě.", milestonePerk: "Milník: 25% šance zcela se vyhnout jakémukoliv fyzickému útoku." }
        ]
      },
      {
        id: "rogue_poison_craft",
        name: "Jedovaté řemeslo",
        class: "Tulák",
        type: "passive",
        iconName: "Droplets",
        ranks: [
          { rank: 1, cost: 1, desc: "Veškeré způsobené DoT stavy (jedy a krvácení) působí o 2 dmg/kolo více." },
          { rank: 2, cost: 2, desc: "DoT stavy působí o 4 dmg/kolo více a trvají o 1 kolo déle." },
          { rank: 3, cost: 3, desc: "DoT stavy působí o 5 dmg/kolo více.", milestonePerk: "Milník: Tulák je zcela imunní vůči Otravě." }
        ]
      },
      {
        id: "rogue_critical_flow",
        name: "Mistr slabin",
        class: "Tulák",
        type: "passive",
        iconName: "Target",
        ranks: [
          { rank: 1, cost: 1, desc: "Kritické zásahy způsobují o 30 % vyšší poškození." },
          { rank: 2, cost: 2, desc: "Kritické zásahy způsobují o 60 % vyšší poškození a rozsah hodu je 19-20." },
          { rank: 3, cost: 3, desc: "Rozsah hodu 19-20 na d20 a +80 % kritického poškození.", milestonePerk: "Milník: Kritický zásah okamžitě obnoví tulákovi 1 AP." }
        ]
      },
      {
        id: "rogue_shadow_veil",
        name: "Stínový závoj",
        class: "Tulák",
        type: "passive",
        iconName: "Eye",
        ranks: [
          { rank: 1, cost: 1, desc: "Pokud tulák neútočil v minulém kole, získává +3 AC." },
          { rank: 2, cost: 2, desc: "Nepřátelé na dálku mají postih -3 k útoku na tuláka." },
          { rank: 3, cost: 3, desc: "+4 AC při obraně a krytí.", milestonePerk: "Milník: Zabití nepřítele učiní tuláka na 1 kolo neviditelným (+5 AC)." }
        ]
      },
      {
        id: "rogue_fortune",
        name: "Zlodějské štěstí",
        class: "Tulák",
        type: "passive",
        iconName: "Sparkles",
        ranks: [
          { rank: 1, cost: 1, desc: "+25 % více nalezeného zlata z monster a truhel." },
          { rank: 2, cost: 2, desc: "+40 % více zlata a vyšší šance na nalezení vzácného lootu." },
          { rank: 3, cost: 3, desc: "+50 % více zlata a šance na drop šperků.", milestonePerk: "Milník: Pokud by útok minul o 1-2 body na kostce, automaticky se promění v úspěšný zásah." }
        ]
      }
    ]
  },

  "Klerik": {
    className: "Klerik",
    description: "Svatý válečník a léčitel oddaný božstvu, který ovládá zářivé světlo a chrání spojence před zkázou.",
    primaryStat: "wis",
    skills: [
      {
        id: "cleric_healing_word",
        name: "Léčivé slovo (Healing Word)",
        class: "Klerik",
        type: "active",
        iconName: "HeartHandshake",
        apCost: 1,
        cooldown: 1,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Magicky zacelí rány: obnoví 15 + moudrost HP.", healAmount: 20 },
          { rank: 2, cost: 2, desc: "Obnoví 25 + moudrost HP a odstraní Krvácení.", healAmount: 30 },
          { rank: 3, cost: 3, desc: "Obnoví 40 + moudrost HP.", healAmount: 45, milestonePerk: "Milník: Zcela odstraní všechny negativní statusy a přidá štít na 15 HP." }
        ]
      },
      {
        id: "cleric_sacred_flame",
        name: "Posvátný plamen (Sacred Flame)",
        class: "Klerik",
        type: "active",
        iconName: "Sun",
        apCost: 1,
        cooldown: 0,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Svaté světlo ozáří cíl za 1d8 + moudrost radiativního poškození (ignoruje kryt a štíty).", damageDice: "1d8" },
          { rank: 2, cost: 2, desc: "Udělí 1d10 + moudrost radiativního poškození a sníží AC cíle o -2.", damageDice: "1d10" },
          { rank: 3, cost: 3, desc: "Udělí 2d8 + moudrost radiativního poškození.", damageDice: "2d8", milestonePerk: "Milník: Cíl je oslepen – jeho příští útok má 50% šanci, že zcela mine." }
        ]
      },
      {
        id: "cleric_bless",
        name: "Požehnání (Bless)",
        class: "Klerik",
        type: "active",
        iconName: "Sparkles",
        apCost: 1,
        cooldown: 3,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Božské požehnání: +2 k útokům a +2 k AC na 3 kola." },
          { rank: 2, cost: 2, desc: "+3 k útokům, +3 k AC a +1d4 ke všem způsobeným zraněním na 3 kola." },
          { rank: 3, cost: 3, desc: "+4 k útokům a AC na 3 kola.", milestonePerk: "Milník: Klerik je po dobu požehnání imunní vůči Zchlazení a Omráčení." }
        ]
      },
      {
        id: "cleric_spiritual_weapon",
        name: "Duchovní zbraň (Spiritual Weapon)",
        class: "Klerik",
        type: "active",
        iconName: "Swords",
        apCost: 2,
        cooldown: 2,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Vyvolá vznášející se zbraň ze světla: okamžitě udělí 1d8 + moudrost a útočí další kolo zdarma.", damageDice: "1d8" },
          { rank: 2, cost: 2, desc: "Udělí 2d6 + moudrost poškození a útočí 2 následující kola.", damageDice: "2d6" },
          { rank: 3, cost: 3, desc: "Udělí 2d8 + moudrost poškození.", damageDice: "2d8", milestonePerk: "Milník: Duchovní zbraň útočí na dva náhodné nepřátele současně." }
        ]
      },
      {
        id: "cleric_holy_nova",
        name: "Svatá záře (Holy Nova)",
        class: "Klerik",
        type: "active",
        iconName: "Sun",
        apCost: 3,
        cooldown: 3,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Výbuch svatého světla: udělí 1d8 + moudrost poškození všem nepřátelům a vyléčí klerika za 15 HP.", damageDice: "1d8", healAmount: 15 },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 2d6 + moudrost poškození všem nepřátelům a vyléčí klerika za 25 HP.", damageDice: "2d6", healAmount: 25 },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 2d10 + moudrost poškození a vyléčí za 35 HP.", damageDice: "2d10", healAmount: 35, milestonePerk: "Milník: Proti nemrtvým a démonům působí dvojnásobné poškození a omráčí je." }
        ]
      },
      // 5 Pasivních
      {
        id: "cleric_light_of_faith",
        name: "Světlo víry",
        class: "Klerik",
        type: "passive",
        iconName: "Sun",
        ranks: [
          { rank: 1, cost: 1, desc: "Veškeré léčení z kouzel a lektvarů je o 20 % silnější." },
          { rank: 2, cost: 2, desc: "Veškeré léčení je o 35 % silnější a přidává štít na 5 HP." },
          { rank: 3, cost: 3, desc: "Léčení je o 50 % silnější.", milestonePerk: "Milník: Každé přeléčení nad maximum HP se převede do dočasného ochranného štítu." }
        ]
      },
      {
        id: "cleric_heavy_armor",
        name: "Obrněný světec",
        class: "Klerik",
        type: "passive",
        iconName: "Shield",
        ranks: [
          { rank: 1, cost: 1, desc: "Získává +2 k AC při nošení střední či těžké zbroje." },
          { rank: 2, cost: 2, desc: "+3 k AC a zkrácení penalizace na obratnost ze zbroje." },
          { rank: 3, cost: 3, desc: "+4 k AC při nošení brnění.", milestonePerk: "Milník: Útočníci na blízko utrží 4 body svatého poškození za každý zásah do klerika." }
        ]
      },
      {
        id: "cleric_divine_will",
        name: "Vůle bohů",
        class: "Klerik",
        type: "passive",
        iconName: "ShieldAlert",
        ranks: [
          { rank: 1, cost: 1, desc: "Pokud klerik klesne na 0 HP, jednou za boj přežije s 20 % maximálních HP." },
          { rank: 2, cost: 2, desc: "Při záchraně před smrtí se obnoví 35 % HP a získá +3 AC na 2 kola." },
          { rank: 3, cost: 3, desc: "Záchrana před smrtí s 50 % HP.", milestonePerk: "Milník: Záchrana před smrtí vyvolá okamžitou Svatou záři zdarma." }
        ]
      },
      {
        id: "cleric_sacred_zeal",
        name: "Posvátná horlivost",
        class: "Klerik",
        type: "passive",
        iconName: "Zap",
        ranks: [
          { rank: 1, cost: 1, desc: "Každé úspěšné vyléčení má 25% šanci přidat +1 AP v příštím kole." },
          { rank: 2, cost: 2, desc: "50% šance na zisk +1 AP po úspěšném léčení." },
          { rank: 3, cost: 3, desc: "Garantovaný zisk +1 AP při prvním léčení v každém kole.", milestonePerk: "Milník: Svatá kouzla mají o 20 % vyšší šanci na kritický zásah." }
        ]
      },
      {
        id: "cleric_radiant_resistance",
        name: "Aura čistoty",
        class: "Klerik",
        type: "passive",
        iconName: "HeartHandshake",
        ranks: [
          { rank: 1, cost: 1, desc: "Trvalá 30% odolnost proti nekrotickému poškození a otravě." },
          { rank: 2, cost: 2, desc: "50% odolnost proti nekrotickému poškození, otravě a nemocem." },
          { rank: 3, cost: 3, desc: "Plná imunita vůči Otravě (🧪) a 50% redukce nekrotického poškození.", milestonePerk: "Milník: Negativní DoT stavy z klerika vyprchají dvakrát rychleji." }
        ]
      }
    ]
  },

  "Bojovník": {
    className: "Bojovník",
    description: "Všestranný válečný taktik vycvičený se všemi zbraněmi, schopný bleskových protiútoků a brutálních poprav.",
    primaryStat: "str",
    skills: [
      {
        id: "fighter_second_wind",
        name: "Druhý dech (Second Wind)",
        class: "Bojovník",
        type: "active",
        iconName: "HeartHandshake",
        apCost: 1,
        cooldown: 3,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Zatneš zuby a okamžitě obnovíš 20 + síla HP.", healAmount: 25 },
          { rank: 2, cost: 2, desc: "Obnovíš 35 + síla HP a získáš +2 AC na 1 kolo.", healAmount: 40 },
          { rank: 3, cost: 3, desc: "Obnovíš 50 + síla HP a získáš +3 AC.", healAmount: 55, milestonePerk: "Milník: Druhý dech okamžitě obnoví také 1 AP a odstraní Krvácení." }
        ]
      },
      {
        id: "fighter_action_surge",
        name: "Akční vlna (Action Surge)",
        class: "Bojovník",
        type: "active",
        iconName: "Zap",
        apCost: 0,
        cooldown: 4,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Překonáš své limity: okamžitě získáš +1 AP v tomto kole zdarma!" },
          { rank: 2, cost: 2, desc: "Okamžitě získáš +2 AP v tomto kole zdarma!" },
          { rank: 3, cost: 3, desc: "Okamžitě získáš +2 AP a +2 k hodu na útok.", milestonePerk: "Milník: Příští útok v tomto kole má garantovaný 100% kritický zásah." }
        ]
      },
      {
        id: "fighter_whirlwind",
        name: "Bojový vír (Whirlwind)",
        class: "Bojovník",
        type: "active",
        iconName: "Swords",
        apCost: 2,
        cooldown: 2,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Roztočíš zbraň a zasáhneš všechny nepřátele za 1d8 + síla poškození.", damageDice: "1d8" },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 2d6 + síla poškození a způsobí Krvácení (🩸 3 dmg/kolo, 2 kola).", damageDice: "2d6", statusEffect: { type: "bleeding", duration: 2, damagePerRound: 3 } },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 2d8 + síla poškození všem.", damageDice: "2d8", statusEffect: { type: "bleeding", duration: 3, damagePerRound: 5 }, milestonePerk: "Milník: Zničí zbroj zasažených nepřátel (-2 AC trvale do konce boje)." }
        ]
      },
      {
        id: "fighter_parry",
        name: "Obranný postoj (Parry & Riposte)",
        class: "Bojovník",
        type: "active",
        iconName: "Shield",
        apCost: 1,
        cooldown: 2,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Zvýšíš AC o +4. Pokud tě nepřítel mine, provedeš protiútok za 1d6 poškození." },
          { rank: 2, cost: 2, desc: "Zvýšíš AC o +5. Protiútok způsobí 1d10 poškození." },
          { rank: 3, cost: 3, desc: "+6 AC při postoji. Protiútok způsobí 2d8 poškození.", milestonePerk: "Milník: Protiútok zasaženého nepřítele okamžitě na 1 kolo omráčí (💫)." }
        ]
      },
      {
        id: "fighter_executioner",
        name: "Popravčí úder (Executioner)",
        class: "Bojovník",
        type: "active",
        iconName: "Skull",
        apCost: 3,
        cooldown: 3,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Zničující seknutí obouruční zbraní za 2d10 + síla poškození.", damageDice: "2d10" },
          { rank: 2, cost: 2, desc: "Udělí 3d10 + síla poškození. Pokud má cíl pod 50 % HP, udělí extra 10 poškození.", damageDice: "3d10" },
          { rank: 3, cost: 3, desc: "Udělí 4d10 + síla poškození.", damageDice: "4d10", milestonePerk: "Milník: Garantované maximální možné poškození na všech kostkách (žádný náhodný nízký hod)." }
        ]
      },
      // 5 Pasivních
      {
        id: "fighter_weapon_mastery",
        name: "Mistr zbraní",
        class: "Bojovník",
        type: "passive",
        iconName: "Swords",
        ranks: [
          { rank: 1, cost: 1, desc: "+2 k poškození všemi zbraněmi na blízko i na dálku." },
          { rank: 2, cost: 2, desc: "+4 k poškození všemi zbraněmi." },
          { rank: 3, cost: 3, desc: "+6 k poškození všemi zbraněmi.", milestonePerk: "Milník: Bojovník může do jedné ruky vzít obouruční zbraň bez postihu." }
        ]
      },
      {
        id: "fighter_armored_colossus",
        name: "Obrněný kolos",
        class: "Bojovník",
        type: "passive",
        iconName: "Shield",
        ranks: [
          { rank: 1, cost: 1, desc: "+2 k AC při nošení středního nebo těžkého brnění." },
          { rank: 2, cost: 2, desc: "+3 k AC a plochá redukce veškerého fyzického zranění o 2." },
          { rank: 3, cost: 3, desc: "+4 k AC a redukce fyzického zranění o 3.", milestonePerk: "Milník: Plná imunita vůči odhození a shození na zem." }
        ]
      },
      {
        id: "fighter_crit_training",
        name: "Bojová průprava",
        class: "Bojovník",
        type: "passive",
        iconName: "Target",
        ranks: [
          { rank: 1, cost: 1, desc: "Kritický zásah padá na hodu 19–20 na d20." },
          { rank: 2, cost: 2, desc: "Kritický zásah na 19–20 a udělí o 30 % vyšší poškození." },
          { rank: 3, cost: 3, desc: "Kritický rozsah 19–20 a +50 % kritického poškození.", milestonePerk: "Milník: Kritický zásah okamžitě aplikuje hluboké Krvácení 🩸." }
        ]
      },
      {
        id: "fighter_resolute",
        name: "Nezlomná vůle",
        class: "Bojovník",
        type: "passive",
        iconName: "HeartHandshake",
        ranks: [
          { rank: 1, cost: 1, desc: "Imunita vůči stavu Oslabení (-dmg) a mentálním debuffům." },
          { rank: 2, cost: 2, desc: "Trvání Omráčení a Zchlazení na bojovníkovi je zkráceno o 1 kolo." },
          { rank: 3, cost: 3, desc: "Odolnost vůči všem omezujícím stavům.", milestonePerk: "Milník: Plná imunita vůči Omráčení (💫)." }
        ]
      },
      {
        id: "fighter_battle_momentum",
        name: "Bojový veterán",
        class: "Bojovník",
        type: "passive",
        iconName: "Zap",
        ranks: [
          { rank: 1, cost: 1, desc: "Každé kolo souboje pasivně zvyšuje útok bojovníka o +1 (max +5)." },
          { rank: 2, cost: 2, desc: "Zvyšuje útok o +1 každé kolo (max +8) a přidává +1 AC každé 2 kola." },
          { rank: 3, cost: 3, desc: "Bojový veterán nabírá sílu každé kolo.", milestonePerk: "Milník: Při dosažení maximálního bonusu získá bojovník trvale +1 AP za kolo." }
        ]
      }
    ]
  },

  "Černokněžník": {
    className: "Černokněžník",
    description: "Smluvně vázaný čaroděj temných entit, který vysává duše, uvrhuje kletby a pálí pekelnými paprsky.",
    primaryStat: "cha",
    skills: [
      {
        id: "warlock_eldritch_blast",
        name: "Tříštivý výboj (Eldritch Blast)",
        class: "Černokněžník",
        type: "active",
        iconName: "Zap",
        apCost: 1,
        cooldown: 0,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Paprsek praskající temné energie za 1d10 + charisma poškození.", damageDice: "1d10" },
          { rank: 2, cost: 2, desc: "Udělí 2d8 + charisma poškození a odhodí cíl.", damageDice: "2d8" },
          { rank: 3, cost: 3, desc: "Udělí 2d10 + charisma poškození.", damageDice: "2d10", milestonePerk: "Milník: Odhodí cíl a sníží jeho iniciativu (-1 AP v dalším tahu)." }
        ]
      },
      {
        id: "warlock_hex",
        name: "Kletba utrpení (Hex)",
        class: "Černokněžník",
        type: "active",
        iconName: "Skull",
        apCost: 1,
        cooldown: 2,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Označí cíl temnou kletbou: každý další útok proti němu způsobí extra 1d6 nekrotického zranění." },
          { rank: 2, cost: 2, desc: "Každý útok proti cíli způsobí extra 1d8 nekrotického zranění a cíl má -2 AC." },
          { rank: 3, cost: 3, desc: "Extra 2d6 nekrotického zranění z každého útoku.", milestonePerk: "Milník: Pokud prokletý cíl zemře, kletba zdarma přeskočí na dalšího nepřítele." }
        ]
      },
      {
        id: "warlock_hellish_rebuke",
        name: "Pekelná odveta (Hellish Rebuke)",
        class: "Černokněžník",
        type: "active",
        iconName: "Flame",
        apCost: 1,
        cooldown: 2,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Plamenná odveta za 1d10 ohnivého poškození; cíl začne Hořet (🔥 3 dmg/kolo, 2 kola).", damageDice: "1d10", statusEffect: { type: "burning", duration: 2, damagePerRound: 3 } },
          { rank: 2, cost: 2, desc: "Udělí 2d8 ohnivého poškození a zapálí nepřítele (5 dmg/kolo, 2 kola).", damageDice: "2d8", statusEffect: { type: "burning", duration: 2, damagePerRound: 5 } },
          { rank: 3, cost: 3, desc: "Udělí 3d8 ohnivého poškození.", damageDice: "3d8", statusEffect: { type: "burning", duration: 3, damagePerRound: 6 }, milestonePerk: "Milník: Pokud je černokněžník pod 30 % HP, toto kouzlo udělí dvojnásobné zranění." }
        ]
      },
      {
        id: "warlock_hunger_of_hadar",
        name: "Hladová temnota (Hunger of Hadar)",
        class: "Černokněžník",
        type: "active",
        iconName: "Moon",
        apCost: 2,
        cooldown: 3,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Sféra prázdnoty zasáhne všechny nepřátele za 1d8 poškození chladem a Zchladí je (❄️).", damageDice: "1d8", statusEffect: { type: "frozen", duration: 1 } },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 2d6 chladného a kyselinového poškození a oslepí bojiště.", damageDice: "2d6", statusEffect: { type: "frozen", duration: 1 } },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 2d8 poškození všem nepřátelům.", damageDice: "2d8", statusEffect: { type: "frozen", duration: 2 }, milestonePerk: "Milník: Zasažení nepřátelé nemohou v temnotě sesílat kouzla ani speciální schopnosti." }
        ]
      },
      {
        id: "warlock_life_drain",
        name: "Vysátí duše (Life Drain)",
        class: "Černokněžník",
        type: "active",
        iconName: "Droplets",
        apCost: 2,
        cooldown: 3,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Vysaje život: udělí 1d12 nekrotického poškození a 50 % způsobeného zranění vyléčí hráče.", damageDice: "1d12" },
          { rank: 2, cost: 2, desc: "Udělí 2d10 poškození a 75 % zranění vyléčí hráče.", damageDice: "2d10" },
          { rank: 3, cost: 3, desc: "Udělí 3d10 poškození a 100 % zranění vyléčí hráče.", damageDice: "3d10", milestonePerk: "Milník: Pokud cíl zabije, černokněžník získá navíc ochranný štít na 20 HP." }
        ]
      },
      // 5 Pasivních
      {
        id: "warlock_dark_patron",
        name: "Záštita Temného pána",
        class: "Černokněžník",
        type: "passive",
        iconName: "Skull",
        ranks: [
          { rank: 1, cost: 1, desc: "Každé zabití nepřítele okamžitě vyléčí černokněžníka o 10 HP." },
          { rank: 2, cost: 2, desc: "Zabití nepřítele vyléčí o 18 HP a přidá +2 k útoku na 1 kolo." },
          { rank: 3, cost: 3, desc: "Zabití nepřítele vyléčí o 25 HP.", milestonePerk: "Milník: Zabití nepřítele také okamžitě obnoví 1 AP." }
        ]
      },
      {
        id: "warlock_agonizing_blast",
        name: "Agonizující výboj",
        class: "Černokněžník",
        type: "passive",
        iconName: "Zap",
        ranks: [
          { rank: 1, cost: 1, desc: "Tříštivý výboj přičítá k poškození plný bonus Charismatu (+3 dmg)." },
          { rank: 2, cost: 2, desc: "Tříštivý výboj má o 20 % vyšší poškození a +1 k hodu na zásah." },
          { rank: 3, cost: 3, desc: "Tříštivý výboj přičítá dvojnásobný bonus Charismatu.", milestonePerk: "Milník: Tříštivý výboj vystřelí automaticky dva paprsky namísto jednoho." }
        ]
      },
      {
        id: "warlock_shadow_armor",
        name: "Mystická zbroj",
        class: "Černokněžník",
        type: "passive",
        iconName: "Shield",
        ranks: [
          { rank: 1, cost: 1, desc: "Trvalý bonus +2 k AC a +5 % k vyhýbání se střelám." },
          { rank: 2, cost: 2, desc: "+3 k AC a 30% odolnost proti nekrotickému a psychickému poškození." },
          { rank: 3, cost: 3, desc: "+4 k AC a 50% odolnost proti nekrotickému poškození.", milestonePerk: "Milník: Pokud je černokněžník zasažen, útočník utrží 5 bodů nekrotického zranění." }
        ]
      },
      {
        id: "warlock_pact_tenacity",
        name: "Paktová houževnatost",
        class: "Černokněžník",
        type: "passive",
        iconName: "HeartHandshake",
        ranks: [
          { rank: 1, cost: 1, desc: "Veškeré negativní status efekty na hráči trvají o 1 kolo méně (min. 1)." },
          { rank: 2, cost: 2, desc: "Negativní statusy trvají o 1 kolo méně a působí o 30 % nižší poškození." },
          { rank: 3, cost: 3, desc: "Statusy působí o 50 % nižší poškození.", milestonePerk: "Milník: Plná imunita vůči kletbám a stavu Zchlazení." }
        ]
      },
      {
        id: "warlock_dot_siphon",
        name: "Živé utrpení",
        class: "Černokněžník",
        type: "passive",
        iconName: "Droplets",
        ranks: [
          { rank: 1, cost: 1, desc: "Kdykoliv nepřítel utrží poškození ze stavu Hoření nebo Kletby, černokněžník se vyléčí o 2 HP." },
          { rank: 2, cost: 2, desc: "Vyléčí o 4 HP z každého tiku DoT stavu na nepřátelích." },
          { rank: 3, cost: 3, desc: "Vyléčí o 6 HP z každého DoT tiku na nepřátelích.", milestonePerk: "Milník: Pokud má nepřítel 2 a více DoT stavů, černokněžník získává +2 k AC a +2 k útoku." }
        ]
      }
    ]
  },

  "Bard": {
    className: "Bard",
    description: "Okouzlující mistr hudby, slov a inspirace, který oslabuje nepřátele výsměchem a léčí harmonickými melodiemi.",
    primaryStat: "cha",
    skills: [
      {
        id: "bard_vicious_mockery",
        name: "Jízlivý posměch (Vicious Mockery)",
        class: "Bard",
        type: "active",
        iconName: "Zap",
        apCost: 1,
        cooldown: 0,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Zasypeš cíl urážkami za 1d6 + charisma psychického poškození; cíl má -3 k hodu na příští útok.", damageDice: "1d6" },
          { rank: 2, cost: 2, desc: "Udělí 1d8 + charisma poškození a cíl má -4 k útoku a -2 k AC.", damageDice: "1d8" },
          { rank: 3, cost: 3, desc: "Udělí 2d6 + charisma psychického poškození.", damageDice: "2d6", milestonePerk: "Milník: Cíl je zmaten: má 35% šanci zaútočit na svého nejbližšího spojence." }
        ]
      },
      {
        id: "bard_song_of_rest",
        name: "Píseň léčení (Song of Rest)",
        class: "Bard",
        type: "active",
        iconName: "HeartHandshake",
        apCost: 1,
        cooldown: 2,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Harmonická melodie obnoví 15 + charisma HP a odstraní Krvácení.", healAmount: 20 },
          { rank: 2, cost: 2, desc: "Obnoví 25 + charisma HP a poskytne regeneraci +4 HP/kolo na 2 kola.", healAmount: 30 },
          { rank: 3, cost: 3, desc: "Obnoví 40 HP a regeneraci +6 HP/kolo na 2 kola.", healAmount: 40, milestonePerk: "Milník: Píseň zároveň odstraní Otravu i Hoření a přidá +2 k AC." }
        ]
      },
      {
        id: "bard_shatter",
        name: "Tříštivý akord (Shatter)",
        class: "Bard",
        type: "active",
        iconName: "Activity",
        apCost: 2,
        cooldown: 2,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Sonická exploze zasáhne všechny nepřátele za 1d8 + charisma hromového poškození.", damageDice: "1d8" },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 2d6 + charisma poškození a zničí nepřátelské štíty.", damageDice: "2d6" },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 2d8 + charisma hromového poškození všem.", damageDice: "2d8", milestonePerk: "Milník: Hromová vlna sníží všem nepřátelům AC o -3 a odhodí je." }
        ]
      },
      {
        id: "bard_enthrall",
        name: "Okouzlení / Fascinace",
        class: "Bard",
        type: "active",
        iconName: "Eye",
        apCost: 1,
        cooldown: 3,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Omámí nepřítele magickou písní: způsobí Omráčení (💫 Stun na 1 kolo).", statusEffect: { type: "stunned", duration: 1 } },
          { rank: 2, cost: 2, desc: "Omráčí cíl na 1 kolo a po probuzení má cíl -2 k útoku.", statusEffect: { type: "stunned", duration: 1 } },
          { rank: 3, cost: 3, desc: "Omráčí cíl na 1 kolo.", statusEffect: { type: "stunned", duration: 1 }, milestonePerk: "Milník: Po probuzení z omráčení ztratí cíl 1 AP v dalším tahu." }
        ]
      },
      {
        id: "bard_crescendo",
        name: "Labutí píseň (Crescendo)",
        class: "Bard",
        type: "active",
        iconName: "Sparkles",
        apCost: 3,
        cooldown: 4,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Grandiózní vyvrcholení symfonie: udělí 2d8 poškození všem nepřátelům a vyléčí barda za 25 HP.", damageDice: "2d8", healAmount: 25 },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 3d8 poškození všem nepřátelům a vyléčí barda za 40 HP.", damageDice: "3d8", healAmount: 40 },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 4d8 poškození všem a plně vyléčí barda.", damageDice: "4d8", healAmount: 999, milestonePerk: "Milník: Okamžitě resetuje cooldowny všech ostatních bardových schopností." }
        ]
      },
      // 5 Pasivních
      {
        id: "bard_inspiration",
        name: "Bardova inspirace",
        class: "Bard",
        type: "passive",
        iconName: "Sparkles",
        ranks: [
          { rank: 1, cost: 1, desc: "Každé 4. kolo souboje získá bard volné +1 AP navíc." },
          { rank: 2, cost: 2, desc: "Každé 3. kolo souboje získá bard volné +1 AP a +2 k hodu na útok." },
          { rank: 3, cost: 3, desc: "Každé 3. kolo souboje získá +1 AP a +3 k útoku.", milestonePerk: "Milník: Inspirace se aktivuje okamžitě v 1. kole každého souboje." }
        ]
      },
      {
        id: "bard_cutting_words",
        name: "Odzbrojující charisma",
        class: "Bard",
        type: "passive",
        iconName: "Zap",
        ranks: [
          { rank: 1, cost: 1, desc: "První útok každého nepřítele v souboji způsobí o 25 % nižší zranění." },
          { rank: 2, cost: 2, desc: "První útok každého nepřítele má o 40 % nižší sílu a -3 k hodu na zásah." },
          { rank: 3, cost: 3, desc: "První útok každého nepřítele má poloviční sílu (-50 % dmg).", milestonePerk: "Milník: Kdykoliv nepřítel mine barda, utrží 4 psychického zranění." }
        ]
      },
      {
        id: "bard_rhythmic_step",
        name: "Rytmický krok",
        class: "Bard",
        type: "passive",
        iconName: "Wind",
        ranks: [
          { rank: 1, cost: 1, desc: "Trvalý bonus +2 k AC a +1 k iniciativě." },
          { rank: 2, cost: 2, desc: "+3 k AC a 15% šance na úplné vyhnutí se fyzickému útoku." },
          { rank: 3, cost: 3, desc: "+4 k AC a 20% šance na vyhnutí se útoku.", milestonePerk: "Milník: Úspěšný úhyb automaticky udělí Jízlivý posměch útočníkovi zdarma." }
        ]
      },
      {
        id: "bard_jack_of_trades",
        name: "Vševěd (Jack of All Trades)",
        class: "Bard",
        type: "passive",
        iconName: "BookOpen",
        ranks: [
          { rank: 1, cost: 1, desc: "+1 ke všem zbraňovým útokům, kouzlům a záchranným hodům." },
          { rank: 2, cost: 2, desc: "+2 ke všem útokům a kouzlům a +15 % vyšší zisky zlata." },
          { rank: 3, cost: 3, desc: "+3 ke všem útokům a kouzlům.", milestonePerk: "Milník: Bard může používat jakékoliv zbraně a magická ohniska bez penalizace." }
        ]
      },
      {
        id: "bard_harmonious_aura",
        name: "Harmonická aura",
        class: "Bard",
        type: "passive",
        iconName: "HeartHandshake",
        ranks: [
          { rank: 1, cost: 1, desc: "Veškeré léčení a štíty na bardovi trvají a léčí o 20 % více." },
          { rank: 2, cost: 2, desc: "Léčení je o 35 % silnější a bard má 30% odolnost proti všem statusům." },
          { rank: 3, cost: 3, desc: "Léčení je o 50 % silnější.", milestonePerk: "Milník: Plná imunita vůči Omráčení a Zmatení." }
        ]
      }
    ]
  },

  "Paladin": {
    className: "Paladin",
    description: "Svatý rytíř v těžké zbroji, který přísahal chránit slabé a ničit temnotu božskými údery.",
    primaryStat: "str",
    skills: [
      {
        id: "paladin_smite",
        name: "Božský úder (Divine Smite)",
        class: "Paladin",
        type: "active",
        iconName: "Sun",
        apCost: 1,
        cooldown: 1,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Zasáhne cíl zbraní s extra 1d8 radiativního poškození.", damageDice: "1d8", damageBonus: 4 },
          { rank: 2, cost: 2, desc: "Úder způsobí extra 2d8 radiativního poškození a sníží AC nepřítele o -2.", damageDice: "2d8", damageBonus: 6 },
          { rank: 3, cost: 3, desc: "Úder způsobí extra 3d8 radiativního poškození.", damageDice: "3d8", damageBonus: 8, milestonePerk: "Milník: Proti démonům a nemrtvým způsobuje dvojnásobné poškození a omráčí je." }
        ]
      },
      {
        id: "paladin_lay_on_hands",
        name: "Vkládání rukou (Lay on Hands)",
        class: "Paladin",
        type: "active",
        iconName: "HeartHandshake",
        apCost: 1,
        cooldown: 2,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Zázračné svaté léčení: obnoví 20 HP a odstraní Otravu (🧪).", healAmount: 20 },
          { rank: 2, cost: 2, desc: "Obnoví 35 HP, odstraní Otravu a Krvácení a přidá štít na 10 HP.", healAmount: 35, shieldAmount: 10 },
          { rank: 3, cost: 3, desc: "Obnoví 50 HP a přidá štít na 20 HP.", healAmount: 50, shieldAmount: 20, milestonePerk: "Milník: Přidá ochranný štít 🛡️ na 25 HP a plnou imunitu vůči statusům na 1 kolo." }
        ]
      },
      {
        id: "paladin_vengeance_strike",
        name: "Přísežný úder pomsty",
        class: "Paladin",
        type: "active",
        iconName: "Swords",
        apCost: 2,
        cooldown: 2,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Odplatný úder za 1d10 + síla; pokud byl paladin v minulém tahu zraněn, způsobí 150 % poškození.", damageDice: "1d10" },
          { rank: 2, cost: 2, desc: "Udělí 2d8 + síla poškození a způsobí Krvácení (🩸 4 dmg/kolo, 2 kola).", damageDice: "2d8", statusEffect: { type: "bleeding", duration: 2, damagePerRound: 4 } },
          { rank: 3, cost: 3, desc: "Udělí 2d10 + síla poškození.", damageDice: "2d10", statusEffect: { type: "bleeding", duration: 3, damagePerRound: 5 }, milestonePerk: "Milník: Oslabí nepřítele: cíl má -4 k poškození do konce boje." }
        ]
      },
      {
        id: "paladin_holy_radiance",
        name: "Očistný záblesk (Holy Radiance)",
        class: "Paladin",
        type: "active",
        iconName: "Sun",
        apCost: 2,
        cooldown: 3,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Záblesk ze štítu oslepí bojiště a udělí 1d8 radiativního poškození všem nepřátelům.", damageDice: "1d8" },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 2d6 poškození všem nepřátelům a sníží jejich útok o -3 na 2 kola.", damageDice: "2d6" },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 2d8 poškození všem.", damageDice: "2d8", milestonePerk: "Milník: Zničí všechny štíty nepřátel a má 40% šanci je omráčit (💫)." }
        ]
      },
      {
        id: "paladin_avatar",
        name: "Avatar spravedlnosti",
        class: "Paladin",
        type: "active",
        iconName: "ShieldAlert",
        apCost: 3,
        cooldown: 5,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Na 2 kola se rozzáříš: získáš +4 AC, imunita vůči statusům a každý úder léčí paladina za 10 HP." },
          { rank: 2, cost: 2, desc: "Na 2 kola získáš +5 AC, plnou imunitu vůči statusům a útoky léčí za 15 HP." },
          { rank: 3, cost: 3, desc: "Na 3 kola získáš +6 AC a útoky léčí za 20 HP.", milestonePerk: "Milník: Po skončení trvání avatara exploduje svaté světlo za 25 AoE poškození do všech nepřátel." }
        ]
      },
      // 5 Pasivních
      {
        id: "paladin_aura_of_protection",
        name: "Aura ochrany",
        class: "Paladin",
        type: "passive",
        iconName: "Shield",
        ranks: [
          { rank: 1, cost: 1, desc: "Trvalý bonus +2 k AC a +10 % odolnost proti všem elementům." },
          { rank: 2, cost: 2, desc: "+3 k AC a 25% odolnost proti ohni, chladu a nekrotickému poškození." },
          { rank: 3, cost: 3, desc: "+4 k AC a 40% odolnost proti elementům.", milestonePerk: "Milník: Plochá redukce veškerého poškození o 3." }
        ]
      },
      {
        id: "paladin_smite_resonance",
        name: "Svatá záře zbraně",
        class: "Paladin",
        type: "passive",
        iconName: "Sun",
        ranks: [
          { rank: 1, cost: 1, desc: "Běžné útoky zbraní mají 20% šanci udělit bonusové radiant poškození (+5 dmg)." },
          { rank: 2, cost: 2, desc: "35% šance na bonusové radiant poškození (+8 dmg)." },
          { rank: 3, cost: 3, desc: "50% šance na radiant poškození.", milestonePerk: "Milník: Každý Božský úder vrátí 1 AP, pokud zasáhne démona, nemrtvého nebo krvácející cíl." }
        ]
      },
      {
        id: "paladin_unyielding_faith",
        name: "Nezlomná víra",
        class: "Paladin",
        type: "passive",
        iconName: "HeartHandshake",
        ranks: [
          { rank: 1, cost: 1, desc: "Imunita vůči stavu Zmatení a strachu." },
          { rank: 2, cost: 2, desc: "Imunita vůči Omráčení (💫 Stun)." },
          { rank: 3, cost: 3, desc: "Plná imunita vůči mentálním debuffům.", milestonePerk: "Milník: Pokud by paladin utrpěl kritický zásah, promění se v běžný zásah." }
        ]
      },
      {
        id: "paladin_retribution",
        name: "Trestající odplata",
        class: "Paladin",
        type: "passive",
        iconName: "Zap",
        ranks: [
          { rank: 1, cost: 1, desc: "Kdykoliv nepřítel mine paladina v boji, utrží 3 body radiant poškození." },
          { rank: 2, cost: 2, desc: "Nepřítel při minutí utrží 6 bodů radiant poškození a má -1 k AC." },
          { rank: 3, cost: 3, desc: "Při minutí utrží 8 bodů radiant poškození.", milestonePerk: "Milník: Kdykoliv nepřítel zasáhne paladina, utrží 5 bodů radiant poškození." }
        ]
      },
      {
        id: "paladin_knight_ethos",
        name: "Rytířský étos",
        class: "Paladin",
        type: "passive",
        iconName: "ShieldAlert",
        ranks: [
          { rank: 1, cost: 1, desc: "+15 k maximálnímu zdraví při nošení těžké zbroje." },
          { rank: 2, cost: 2, desc: "+25 k maximálnímu zdraví a +1 k hodu na útok." },
          { rank: 3, cost: 3, desc: "+40 k maximálnímu zdraví.", milestonePerk: "Milník: Veškeré DoT efekty na paladinovi působí o 50 % nižší poškození." }
        ]
      }
    ]
  },

  "Mnich": {
    className: "Mnich",
    description: "Rychlý mistr bojových umění a Ki energie, který řetězí bleskové údery pěstmi a vyřazuje nepřátele z boje.",
    primaryStat: "dex",
    skills: [
      {
        id: "monk_flurry_of_blows",
        name: "Příval ran (Flurry of Blows)",
        class: "Mnich",
        type: "active",
        iconName: "Zap",
        apCost: 1,
        cooldown: 0,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Blesková série dvou rychlých úderů: udělí 2x 1d4 + obratnost poškození.", damageDice: "2d4" },
          { rank: 2, cost: 2, desc: "Udělí 2x 1d6 + obratnost poškození a má 20% šanci omráčit cíl.", damageDice: "2d6" },
          { rank: 3, cost: 3, desc: "Udělí 3x 1d6 + obratnost poškození.", damageDice: "3d6", milestonePerk: "Milník: Třetí úder je garantovaný kritický zásah s odhozením." }
        ]
      },
      {
        id: "monk_stunning_strike",
        name: "Omračující úder (Stunning Strike)",
        class: "Mnich",
        type: "active",
        iconName: "Activity",
        apCost: 1,
        cooldown: 2,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Přesný úder do vitálního bodu za 1d8 + obratnost; cíl je Omráčen (💫 Stun na 1 kolo).", damageDice: "1d8", statusEffect: { type: "stunned", duration: 1 } },
          { rank: 2, cost: 2, desc: "Udělí 2d6 + obratnost poškození, omráčí cíl na 1 kolo a sníží jeho AC o -2.", damageDice: "2d6", statusEffect: { type: "stunned", duration: 1 } },
          { rank: 3, cost: 3, desc: "Udělí 2d8 + obratnost poškození a omráčí cíl.", damageDice: "2d8", statusEffect: { type: "stunned", duration: 1 }, milestonePerk: "Milník: Sníží AC cíle trvale o -3 a cíl ztratí 1 AP po probuzení." }
        ]
      },
      {
        id: "monk_deflect_missiles",
        name: "Odražení střel (Deflect Missiles)",
        class: "Mnich",
        type: "active",
        iconName: "Shield",
        apCost: 1,
        cooldown: 2,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Bleskový reflex: sníží poškození z příštího útoku o 60 % a vrátí 1d6 poškození útočníkovi." },
          { rank: 2, cost: 2, desc: "Sníží zranění o 80 % a vrátí 1d10 poškození útočníkovi." },
          { rank: 3, cost: 3, desc: "Zcela zneškodní příští útok (100 % redukce) a vrátí útočníkovi plné poškození.", milestonePerk: "Milník: Úspěšné odražení obnoví mnichovi 1 AP." }
        ]
      },
      {
        id: "monk_spinning_kick",
        name: "Kop hurikánu (Spinning Kick)",
        class: "Mnich",
        type: "active",
        iconName: "Wind",
        apCost: 2,
        cooldown: 2,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Kruhový kop zasáhne všechny nepřátele za 1d8 + obratnost poškození a odhodí je.", damageDice: "1d8" },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 2d6 poškození a způsobí všem Zchlazení/Zpomalení (❄️ -1 AP).", damageDice: "2d6", statusEffect: { type: "frozen", duration: 1 } },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 2d8 poškození všem nepřátelům.", damageDice: "2d8", statusEffect: { type: "frozen", duration: 1 }, milestonePerk: "Milník: 40% šance omráčit všechny zasažené nepřátele." }
        ]
      },
      {
        id: "monk_quivering_palm",
        name: "Dlaň prázdnoty (Quivering Palm)",
        class: "Mnich",
        type: "active",
        iconName: "Skull",
        apCost: 3,
        cooldown: 4,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Vyšle do těla nepřítele smrtící Ki vibrace za 2d10 poškození; po 1 kole vybuchne za dalších 15 dmg.", damageDice: "2d10" },
          { rank: 2, cost: 2, desc: "Udělí 3d10 poškození; po 1 kole vybuchne za dalších 25 dmg.", damageDice: "3d10" },
          { rank: 3, cost: 3, desc: "Udělí 4d10 poškození.", damageDice: "4d10", milestonePerk: "Milník: Pokud má cíl pod 35 % HP, okamžitě na místě padne bez možnosti záchrany." }
        ]
      },
      // 5 Pasivních
      {
        id: "monk_unarmored_movement",
        name: "Obrana beze zbraně",
        class: "Mnich",
        type: "passive",
        iconName: "Shield",
        ranks: [
          { rank: 1, cost: 1, desc: "Pokud nemáš zbroj ani štít, získáváš +2 k AC a +2 k iniciativě." },
          { rank: 2, cost: 2, desc: "Získáváš +3 k AC a 15% šanci na vyhnutí se útoku." },
          { rank: 3, cost: 3, desc: "+4 k AC a 25% šance na vyhnutí se útoku.", milestonePerk: "Milník: Úspěšný úhyb okamžitě zraní útočníka za 6 bodů fyzického poškození." }
        ]
      },
      {
        id: "monk_iron_fists",
        name: "Železné pěsti",
        class: "Mnich",
        type: "passive",
        iconName: "Swords",
        ranks: [
          { rank: 1, cost: 1, desc: "Útoky beze zbraně mají základní kostku 1d6 (místo 1d4) a +2 k poškození." },
          { rank: 2, cost: 2, desc: "Základní kostka 1d8 a +4 k poškození." },
          { rank: 3, cost: 3, desc: "Základní kostka 1d10 a +6 k poškození.", milestonePerk: "Milník: Útoky pěstmi ignorují 50 % zbroje cíle (AC)." }
        ]
      },
      {
        id: "monk_ki_flow",
        name: "Plynulý tok Ki",
        class: "Mnich",
        type: "passive",
        iconName: "Zap",
        ranks: [
          { rank: 1, cost: 1, desc: "Každý kritický zásah okamžitě obnoví mnichovi 1 AP." },
          { rank: 2, cost: 2, desc: "Kritické zásahy obnoví 1 AP a rozsah kritického zásahu je 19-20." },
          { rank: 3, cost: 3, desc: "Kritický rozsah 19-20 a obnova 1 AP.", milestonePerk: "Milník: Kritický zásah zároveň vyléčí mnicha o 10 HP." }
        ]
      },
      {
        id: "monk_purity_of_body",
        name: "Čistota těla",
        class: "Mnich",
        type: "passive",
        iconName: "HeartHandshake",
        ranks: [
          { rank: 1, cost: 1, desc: "Trvalá 50% odolnost proti Otravě (🧪) a nemocem." },
          { rank: 2, cost: 2, desc: "Plná imunita vůči Otravě (🧪) a odolnost proti krvácení." },
          { rank: 3, cost: 3, desc: "Plná imunita vůči Otravě i Krvácení.", milestonePerk: "Milník: Imunita vůči stavu Zchlazení (❄️) a mrazu." }
        ]
      },
      {
        id: "monk_diamond_soul",
        name: "Diamantová duše",
        class: "Mnich",
        type: "passive",
        iconName: "Sparkles",
        ranks: [
          { rank: 1, cost: 1, desc: "+2 ke všem záchranným hodům a mentálním odolnostem." },
          { rank: 2, cost: 2, desc: "+4 k záchranným hodům a 25% šance odrazit jakékoliv nepřátelské kouzlo." },
          { rank: 3, cost: 3, desc: "+5 k záchranným hodům a 40% šance odrazit kouzlo.", milestonePerk: "Milník: Pokud mnich selže v záchranném hodu, může si hod okamžitě zdarma zopakovat." }
        ]
      }
    ]
  },

  "Druid": {
    className: "Druid",
    description: "Strážce rovnováhy přírody, který ovládá živly, spoutává nepřátele trním a proměňuje se v dravou šelmu.",
    primaryStat: "wis",
    skills: [
      {
        id: "druid_wild_shape",
        name: "Zvířecí podoba (Medvěd)",
        class: "Druid",
        type: "active",
        iconName: "Activity",
        apCost: 1,
        cooldown: 3,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Proměníš se v jeskynního medvěda na 3 kola: okamžitě získáš +20 dočasných HP a drápy za 1d10 poškození.", shieldAmount: 20 },
          { rank: 2, cost: 2, desc: "Získáš +35 dočasných HP, drápy za 2d8 poškození a +2 AC na 3 kola.", shieldAmount: 35 },
          { rank: 3, cost: 3, desc: "Získáš +50 dočasných HP a drápy za 2d10 poškození.", shieldAmount: 50, milestonePerk: "Milník: Řev medvěda při proměně na 1 kolo omráčí hlavní cíl (💫)." }
        ]
      },
      {
        id: "druid_entangle",
        name: "Škrtící liány (Entangle)",
        class: "Druid",
        type: "active",
        iconName: "Wind",
        apCost: 1,
        cooldown: 2,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Liány vyrazí ze země: znehybní cíl, udělí 1d6 poškození a způsobí Krvácení (🩸 3 dmg/kolo, 2 kola).", damageDice: "1d6", statusEffect: { type: "bleeding", duration: 2, damagePerRound: 3 } },
          { rank: 2, cost: 2, desc: "Udělí 1d8 poškození a znehybní cíl (cíl nemůže útočit v příštím tahu).", damageDice: "1d8", statusEffect: { type: "bleeding", duration: 2, damagePerRound: 5 } },
          { rank: 3, cost: 3, desc: "Udělí 2d8 poškození.", damageDice: "2d8", statusEffect: { type: "bleeding", duration: 3, damagePerRound: 6 }, milestonePerk: "Milník: Cíl je zcela spoután a ztratí 2 AP." }
        ]
      },
      {
        id: "druid_spike_growth",
        name: "Trnová salva (Spike Growth)",
        class: "Druid",
        type: "active",
        iconName: "Crosshair",
        apCost: 2,
        cooldown: 2,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Pokryje bojiště ostrými trny: udělí 1d8 + moudrost poškození všem nepřátelům a způsobí Krvácení (🩸).", damageDice: "1d8", statusEffect: { type: "bleeding", duration: 2, damagePerRound: 3 } },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 2d6 poškození a způsobí Krvácení všem nepřátelům.", damageDice: "2d6", statusEffect: { type: "bleeding", duration: 2, damagePerRound: 4 } },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 2d8 poškození všem.", damageDice: "2d8", statusEffect: { type: "bleeding", duration: 3, damagePerRound: 5 }, milestonePerk: "Milník: Trny sníží rychlost všech nepřátel (-1 AP v dalším kole)." }
        ]
      },
      {
        id: "druid_healing_blossom",
        name: "Léčivý pramen",
        class: "Druid",
        type: "active",
        iconName: "HeartHandshake",
        apCost: 1,
        cooldown: 2,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Přírodní zhojení: obnoví 18 + moudrost HP a odstraní Otravu.", healAmount: 22 },
          { rank: 2, cost: 2, desc: "Obnoví 30 + moudrost HP, odstraní Otravu a Hoření a přidá regeneraci +4 HP na 2 kola.", healAmount: 35 },
          { rank: 3, cost: 3, desc: "Obnoví 45 HP a regeneraci +6 HP na 2 kola.", healAmount: 50, milestonePerk: "Milník: Okamžitě vyčistí všechny negativní DoT stavy a přidá štít na 15 HP." }
        ]
      },
      {
        id: "druid_call_lightning",
        name: "Blesková bouře (Call Lightning)",
        class: "Druid",
        type: "active",
        iconName: "Zap",
        apCost: 3,
        cooldown: 3,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Blesk z bouřkového mraku udeří za 2d8 + moudrost bleskového poškození do všech nepřátel.", damageDice: "2d8" },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 3d8 poškození všem nepřátelům a má 30% šanci omráčit hlavní terč.", damageDice: "3d8" },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 4d8 poškození všem.", damageDice: "4d8", milestonePerk: "Milník: 50% šance omráčit (💫) VŠECHNY zasažené nepřátele." }
        ]
      },
      // 5 Pasivních
      {
        id: "druid_forest_spirit",
        name: "Duch lesa",
        class: "Druid",
        type: "passive",
        iconName: "Shield",
        ranks: [
          { rank: 1, cost: 1, desc: "Zákaz kovového brnění; kožené a dřevěné předměty dávají +2 AC navíc." },
          { rank: 2, cost: 2, desc: "+3 AC z přírodního brnění a +10 k maximálnímu zdraví." },
          { rank: 3, cost: 3, desc: "+4 AC a +20 Max HP.", milestonePerk: "Milník: Plná imunita vůči Otravě (🧪) a kyselinám." }
        ]
      },
      {
        id: "druid_thorns_skin",
        name: "Trnitá kůže",
        class: "Druid",
        type: "passive",
        iconName: "Crosshair",
        ranks: [
          { rank: 1, cost: 1, desc: "Útočníci na blízko utrží 3 body bodného poškození za každý zásah do druida." },
          { rank: 2, cost: 2, desc: "Útočníci utrží 5 bodů poškození a mají 25% šanci, že začnou Krvácet (🩸)." },
          { rank: 3, cost: 3, desc: "Útočníci utrží 7 bodů poškození a 50% šanci na Krvácení.", milestonePerk: "Milník: Trnitá kůže se v Medvědí podobě zdvojnásobuje (14 bodů poškození útočníkovi)." }
        ]
      },
      {
        id: "druid_symbiosis",
        name: "Přírodní symbióza",
        class: "Druid",
        type: "passive",
        iconName: "HeartHandshake",
        ranks: [
          { rank: 1, cost: 1, desc: "Léčivé lektvary a bylinky mají o 30 % vyšší účinnost." },
          { rank: 2, cost: 2, desc: "Léčivé lektvary mají o 50 % vyšší účinnost a obnoví +1 AP." },
          { rank: 3, cost: 3, desc: "Lektvary mají o 70 % vyšší účinnost.", milestonePerk: "Milník: Vypití lektvaru v boji nestojí žádné AP (0 AP jednou za boj)." }
        ]
      },
      {
        id: "druid_beast_tenacity",
        name: "Houževnatost šelmy",
        class: "Druid",
        type: "passive",
        iconName: "Activity",
        ranks: [
          { rank: 1, cost: 1, desc: "V medvědí podobě má druid +2 k fyzickému poškození." },
          { rank: 2, cost: 2, desc: "V medvědí podobě má +4 k poškození a +2 k AC." },
          { rank: 3, cost: 3, desc: "+6 k poškození v medvědí podobě.", milestonePerk: "Milník: Medvědí podoba trvá o 2 kola déle a přidává dalších +20 dočasných HP." }
        ]
      },
      {
        id: "druid_earth_gift",
        name: "Dar Matky Země",
        class: "Druid",
        type: "passive",
        iconName: "Sun",
        ranks: [
          { rank: 1, cost: 1, desc: "Při poklesu pod 25 % HP vyvolá ochranný krunýř z kůry (+4 AC na 2 kola)." },
          { rank: 2, cost: 2, desc: "Při poklesu pod 25 % HP získá +5 AC a okamžitě se vyléčí o 20 HP." },
          { rank: 3, cost: 3, desc: "+6 AC a léčení o 30 HP.", milestonePerk: "Milník: Krunýř z kůry zároveň zapálí a omráčí útočníka." }
        ]
      }
    ]
  },

  "Hraničář": {
    className: "Hraničář",
    description: "Zkušený lovec a stopař, který vládne smrtící přesností luku, klade zákeřné pasti a zná slabiny všech bestií.",
    primaryStat: "dex",
    skills: [
      {
        id: "ranger_hunters_mark",
        name: "Značka lovce (Hunter's Mark)",
        class: "Hraničář",
        type: "active",
        iconName: "Target",
        apCost: 1,
        cooldown: 2,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Označí cíl: všechny další útoky šípy proti němu způsobí extra 1d6 poškození." },
          { rank: 2, cost: 2, desc: "Všechny útoky způsobí extra 1d8 poškození a cíl má -2 k AC." },
          { rank: 3, cost: 3, desc: "Extra 2d6 poškození z každého šípu.", milestonePerk: "Milník: Šípy na označený cíl NIKDY neminou (ignoruje kryt a zbroj)." }
        ]
      },
      {
        id: "ranger_piercing_shot",
        name: "Průrazný šíp (Piercing Shot)",
        class: "Hraničář",
        type: "active",
        iconName: "Crosshair",
        apCost: 1,
        cooldown: 1,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Šíp s kaleným hrotem za 1d8 + obratnost poškození; ignoruje brnění a způsobí Krvácení (🩸 3 dmg/kolo, 2 kola).", damageDice: "1d8", statusEffect: { type: "bleeding", duration: 2, damagePerRound: 3 } },
          { rank: 2, cost: 2, desc: "Udělí 2d6 + obratnost poškození a způsobí Krvácení (5 dmg/kolo, 3 kola).", damageDice: "2d6", statusEffect: { type: "bleeding", duration: 3, damagePerRound: 5 } },
          { rank: 3, cost: 3, desc: "Udělí 2d8 + obratnost poškození.", damageDice: "2d8", statusEffect: { type: "bleeding", duration: 3, damagePerRound: 6 }, milestonePerk: "Milník: Sníží AC nepřítele trvale o -3." }
        ]
      },
      {
        id: "ranger_volley",
        name: "Krupobití šípů (Volley)",
        class: "Hraničář",
        type: "active",
        iconName: "Wind",
        apCost: 2,
        cooldown: 2,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Vystřelí déšť šípů, který zasáhne všechny nepřátele za 1d8 + obratnost poškození.", damageDice: "1d8" },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 2d6 + obratnost poškození a má 35% šanci způsobit Zchlazení/Zpomalení (❄️).", damageDice: "2d6", statusEffect: { type: "frozen", duration: 1 } },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 2d8 + obratnost poškození všem.", damageDice: "2d8", statusEffect: { type: "frozen", duration: 1 }, milestonePerk: "Milník: Aplikuje Značku lovce na VŠECHNY zasažené nepřátele." }
        ]
      },
      {
        id: "ranger_poison_trap",
        name: "Otrávená past",
        class: "Hraničář",
        type: "active",
        iconName: "Droplets",
        apCost: 1,
        cooldown: 2,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Položí past: nepřítel utrží 1d6 poškození a je Otráven (🧪 4 dmg/kolo, 2 kola, -2 k útoku).", damageDice: "1d6", statusEffect: { type: "poisoned", duration: 2, damagePerRound: 4 } },
          { rank: 2, cost: 2, desc: "Udělí 2d6 poškození a způsobí silnou Otravu (6 dmg/kolo, 3 kola).", damageDice: "2d6", statusEffect: { type: "poisoned", duration: 3, damagePerRound: 6 } },
          { rank: 3, cost: 3, desc: "Udělí 2d8 poškození.", damageDice: "2d8", statusEffect: { type: "poisoned", duration: 3, damagePerRound: 7 }, milestonePerk: "Milník: Past exploduje plošně a otráví všechny okolní nepřátele." }
        ]
      },
      {
        id: "ranger_snipe",
        name: "Smrtící mířená rána (Snipe)",
        class: "Hraničář",
        type: "active",
        iconName: "Target",
        apCost: 3,
        cooldown: 3,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Dlouhé míření na vitální bod za 2d10 + obratnost poškození.", damageDice: "2d10" },
          { rank: 2, cost: 2, desc: "Udělí 3d10 + obratnost poškození. Na označený cíl udělí +15 extra poškození.", damageDice: "3d10" },
          { rank: 3, cost: 3, desc: "Udělí 4d10 + obratnost poškození.", damageDice: "4d10", milestonePerk: "Milník: Garantovaný kritický zásah s trojnásobným poškozením (x3 multiplier)." }
        ]
      },
      // 5 Pasivních
      {
        id: "ranger_archery_mastery",
        name: "Mistr lukostřelby",
        class: "Hraničář",
        type: "passive",
        iconName: "Crosshair",
        ranks: [
          { rank: 1, cost: 1, desc: "+2 k hodu na útok a +2 k poškození se všemi luky a kušemi." },
          { rank: 2, cost: 2, desc: "+3 k útoku a +4 k poškození se střelnými zbraněmi." },
          { rank: 3, cost: 3, desc: "+4 k útoku a +6 k poškození.", milestonePerk: "Milník: Střelba zblízka nemá žádný postih (lze střílet i tváří v tvář)." }
        ]
      },
      {
        id: "ranger_tracker_insight",
        name: "Stopařův postřeh",
        class: "Hraničář",
        type: "passive",
        iconName: "Eye",
        ranks: [
          { rank: 1, cost: 1, desc: "+3 k iniciativě a 10% šance na první úder zdarma před začátkem kola." },
          { rank: 2, cost: 2, desc: "+5 k iniciativě a 25% šance na úder zdarma." },
          { rank: 3, cost: 3, desc: "+7 k iniciativě.", milestonePerk: "Milník: Hraničář má v 1. kole každého souboje +1 AP navíc." }
        ]
      },
      {
        id: "ranger_predator_instinct",
        name: "Znalost slabin",
        class: "Hraničář",
        type: "passive",
        iconName: "Skull",
        ranks: [
          { rank: 1, cost: 1, desc: "Útoky proti zvířatům, bestiím a humanoidům působí o 15 % vyšší poškození." },
          { rank: 2, cost: 2, desc: "Útoky působí o 25 % vyšší poškození a mají vyšší šanci na kritický zásah." },
          { rank: 3, cost: 3, desc: "Útoky působí o 35 % vyšší poškození.", milestonePerk: "Milník: Zabití nepřítele se Značkou lovce obnoví 2 AP a 10 HP." }
        ]
      },
      {
        id: "ranger_camouflage",
        name: "Splynutí s terénem",
        class: "Hraničář",
        type: "passive",
        iconName: "Shield",
        ranks: [
          { rank: 1, cost: 1, desc: "Nepřátelé na dálku mají postih -2 k útoku na hraničáře a hraničář má +1 AC." },
          { rank: 2, cost: 2, desc: "Nepřátelé na dálku mají postih -3 k útoku a hraničář má +2 AC." },
          { rank: 3, cost: 3, desc: "Postih -4 k nepřátelským útokům na dálku.", milestonePerk: "Milník: 25% šance na úplné zneškodnění nepřátelské střely." }
        ]
      },
      {
        id: "ranger_poison_resistance",
        name: "Zálesácká odolnost",
        class: "Hraničář",
        type: "passive",
        iconName: "HeartHandshake",
        ranks: [
          { rank: 1, cost: 1, desc: "50% odolnost proti Otravě (🧪) a pastem." },
          { rank: 2, cost: 2, desc: "Plná imunita vůči Otravě a 50% odolnost vůči Krvácení." },
          { rank: 3, cost: 3, desc: "Plná imunita vůči Otravě i Krvácení.", milestonePerk: "Milník: Plochá redukce zranění ze všech DoT efektů o 4." }
        ]
      }
    ]
  },

  "Čaroděj": {
    className: "Čaroděj",
    description: "Nositel nespoutané syrové magie a dračí krve, který ohýbá pravidla kouzlení pomocí metamagie a způsobuje exploze chaosu.",
    primaryStat: "cha",
    skills: [
      {
        id: "sorc_fire_bolt",
        name: "Ohnivý zášleh (Fire Bolt)",
        class: "Čaroděj",
        type: "active",
        iconName: "Flame",
        apCost: 1,
        cooldown: 0,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Vystřelí plamenný šleh za 1d10 + charisma poškození; 30% šance na Hoření (🔥 3 dmg/kolo, 2 kola).", damageDice: "1d10", statusEffect: { type: "burning", duration: 2, damagePerRound: 3, chance: 0.3 } },
          { rank: 2, cost: 2, desc: "Udělí 2d8 + charisma poškození; garantované Hoření (5 dmg/kolo, 2 kola).", damageDice: "2d8", statusEffect: { type: "burning", duration: 2, damagePerRound: 5 } },
          { rank: 3, cost: 3, desc: "Udělí 2d10 + charisma poškození.", damageDice: "2d10", statusEffect: { type: "burning", duration: 3, damagePerRound: 6 }, milestonePerk: "Milník: Hoření z tohoto kouzla trvá 3 kola a při smrti cíle exploduje do okolí." }
        ]
      },
      {
        id: "sorc_chaos_orb",
        name: "Koule chaosu (Chaos Orb)",
        class: "Čaroděj",
        type: "active",
        iconName: "Sparkles",
        apCost: 1,
        cooldown: 1,
        targetType: "single",
        ranks: [
          { rank: 1, cost: 1, desc: "Koule náhodného elementu (Oheň 🔥, Led ❄️, nebo Blesk ⚡) za 1d12 + charisma poškození.", damageDice: "1d12" },
          { rank: 2, cost: 2, desc: "Udělí 2d10 + charisma poškození a aplikuje příslušný status efekt (Hoření, Zchlazení či Omráčení).", damageDice: "2d10" },
          { rank: 3, cost: 3, desc: "Udělí 3d10 + charisma poškození.", damageDice: "3d10", milestonePerk: "Milník: Koule se po zásahu odrazí na druhého živého nepřítele za plné poškození." }
        ]
      },
      {
        id: "sorc_burning_hands",
        name: "Plamenná vlna (Burning Hands)",
        class: "Čaroděj",
        type: "active",
        iconName: "Flame",
        apCost: 2,
        cooldown: 2,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Vějíř plamenů zasáhne všechny nepřátele za 1d8 + charisma poškození a zapálí je (🔥 3 dmg/kolo).", damageDice: "1d8", statusEffect: { type: "burning", duration: 2, damagePerRound: 3 } },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 2d6 + charisma poškození a způsobí silné Hoření (5 dmg/kolo, 2 kola).", damageDice: "2d6", statusEffect: { type: "burning", duration: 2, damagePerRound: 5 } },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 2d8 + charisma poškození všem.", damageDice: "2d8", statusEffect: { type: "burning", duration: 3, damagePerRound: 6 }, milestonePerk: "Milník: Ignoruje ohnivou odolnost nepřátel a spálí jejich zbroj (-2 AC)." }
        ]
      },
      {
        id: "sorc_quickened_spell",
        name: "Metamagie: Zrychlené kouzlo",
        class: "Čaroděj",
        type: "active",
        iconName: "Zap",
        apCost: 0,
        cooldown: 3,
        targetType: "self",
        ranks: [
          { rank: 1, cost: 1, desc: "Metamagický zášleh: sníží AP cenu příštího kouzla v tomto kole o 1 AP!" },
          { rank: 2, cost: 2, desc: "Sníží AP cenu příštího kouzla o 1 AP a přidá +2 k hodu na zásah." },
          { rank: 3, cost: 3, desc: "Sníží AP cenu příštího kouzla o 1 AP a přidá +4 k zásahu.", milestonePerk: "Milník: Příští kouzlo v tomto kole má garantovaný 100% kritický zásah." }
        ]
      },
      {
        id: "sorc_meteor_drop",
        name: "Meteorický pád",
        class: "Čaroděj",
        type: "active",
        iconName: "Skull",
        apCost: 3,
        cooldown: 4,
        targetType: "aoe",
        ranks: [
          { rank: 1, cost: 1, desc: "[AoE] Přivolá padající meteorit: masivní poškození za 2d10 do všech nepřátel a Hoření 🔥.", damageDice: "2d10", statusEffect: { type: "burning", duration: 2, damagePerRound: 4 } },
          { rank: 2, cost: 2, desc: "[AoE] Udělí 3d10 poškození všem a způsobí Hoření (6 dmg/kolo, 2 kola).", damageDice: "3d10", statusEffect: { type: "burning", duration: 2, damagePerRound: 6 } },
          { rank: 3, cost: 3, desc: "[AoE] Udělí 4d10 poškození všem.", damageDice: "4d10", statusEffect: { type: "burning", duration: 3, damagePerRound: 8 }, milestonePerk: "Milník: Tlaková vlna meteoritu omráčí (💫 Stun) všechny přeživší nepřátele na 1 kolo." }
        ]
      },
      // 5 Pasivních
      {
        id: "sorc_draconic_blood",
        name: "Dračí krev",
        class: "Čaroděj",
        type: "passive",
        iconName: "Shield",
        ranks: [
          { rank: 1, cost: 1, desc: "Přirozená šupinatá kůže: +2 k AC a +10 k maximálnímu zdraví." },
          { rank: 2, cost: 2, desc: "+3 k AC, +20 Max HP a 30% odolnost proti ohni." },
          { rank: 3, cost: 3, desc: "+4 k AC, +30 Max HP a 50% odolnost proti ohni.", milestonePerk: "Milník: Plná imunita vůči Hoření (🔥) a spálení." }
        ]
      },
      {
        id: "sorc_elemental_overload",
        name: "Elementální přetížení",
        class: "Čaroděj",
        type: "passive",
        iconName: "Flame",
        ranks: [
          { rank: 1, cost: 1, desc: "Kritické zásahy kouzly vyvolají vedlejší explozi za 25 % způsobeného poškození do všech kolem." },
          { rank: 2, cost: 2, desc: "Vedlejší exploze za 40 % poškození do všech nepřátel." },
          { rank: 3, cost: 3, desc: "Vedlejší exploze za 50 % poškození.", milestonePerk: "Milník: Zasažení nepřátelé v explozi začnou okamžitě Hořet." }
        ]
      },
      {
        id: "sorc_metamagic_surge",
        name: "Metamagická zásoba",
        class: "Čaroděj",
        type: "passive",
        iconName: "Sparkles",
        ranks: [
          { rank: 1, cost: 1, desc: "Při seslání kouzla máš 15% šanci, že kouzlo nespotřebuje cooldown." },
          { rank: 2, cost: 2, desc: "25% šance na seslání kouzla bez cooldownu." },
          { rank: 3, cost: 3, desc: "35% šance na seslání kouzla bez cooldownu.", milestonePerk: "Milník: Schopnost Zrychlené kouzlo lze použít dvakrát za boj bez cooldownu." }
        ]
      },
      {
        id: "sorc_mana_siphon",
        name: "Přelévání many",
        class: "Čaroděj",
        type: "passive",
        iconName: "Zap",
        ranks: [
          { rank: 1, cost: 1, desc: "Zabití nepřítele kouzlem má 50% šanci přidat +1 AP v tomto kole." },
          { rank: 2, cost: 2, desc: "Zabití nepřítele garantuje +1 AP v tomto kole." },
          { rank: 3, cost: 3, desc: "Garantovaný zisk +1 AP a +10 HP při zabití kouzlem.", milestonePerk: "Milník: Zabití nepřítele zkrátí cooldown Meteorického pádu o 2 kola." }
        ]
      },
      {
        id: "sorc_wild_fury",
        name: "Nespoutaná zuřivost",
        class: "Čaroděj",
        type: "passive",
        iconName: "Activity",
        ranks: [
          { rank: 1, cost: 1, desc: "Při poklesu pod 30 % HP působí všechna kouzla o 15 % vyšší poškození." },
          { rank: 2, cost: 2, desc: "Při poklesu pod 30 % HP působí kouzla o 25 % vyšší poškození a mají +2 AC." },
          { rank: 3, cost: 3, desc: "Kouzla působí o 35 % vyšší poškození pod 30 % HP.", milestonePerk: "Milník: Při poklesu pod 20 % HP vyvolá automatickou Plamennou vlnu zdarma." }
        ]
      }
    ]
  }
};
