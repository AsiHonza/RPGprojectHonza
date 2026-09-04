CLASS_TEMPLATES = {
    'Barbar': {
        'inventory': [
            {
                'id': 'c_greataxe',
                'icon': 'Sword',
                'name': 'Obouruční sekera',
                'slot': 'hlavní ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 2,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +2 (1d12)',
                'sell_price': 20,
                'description': 'Těžká obouruční sekera se zubatým ostřím.'
            },
            {
                'id': 'c_rags',
                'icon': 'Shirt',
                'name': 'Kožené hadry',
                'slot': 'hruď',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Obrana: 0',
                'sell_price': 2,
                'description': 'Barbar spoléhá na svou houževnatost spíše než na brnění.'
            },
            {
                'id': 'c_potion_barb',
                'icon': 'Potion',
                'name': 'Slabý léčivý lektvar',
                'slot': 'žádný',
                'type': 'lektvar',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 25,
                'stats': 'Léčení: +25 HP',
                'sell_price': 10,
                'description': 'Rudá bylinná tinktura. Po vypití zacelí rány a obnoví 25 HP.'
            }
        ],
        'equipped': {
            'hlava': None,
            'hruď': 'c_rags',
            'hlavní ruka': 'c_greataxe',
            'druhá ruka': None,
            'prsten': None,
            'krk': None
        },
        'available_skills': [
            {'id': 'rage', 'name': 'Zuřivost', 'desc': 'Dočasně zvýší poškození a fyzickou odolnost (Aktivní).'},
            {'id': 'reckless', 'name': 'Bezohledný útok', 'desc': 'Výhoda na útok, ale nepřátelé mají výhodu proti tobě (Aktivní).'},
            {'id': 'toughness', 'name': 'Zarputilost', 'desc': 'Tvé maximální zdraví se zvýší (Pasivní).'}
        ],
        'starting_skills': [
            {'id': 'rage', 'name': 'Zuřivost', 'desc': 'Dočasně zvýší poškození a fyzickou odolnost (Aktivní).'}
        ]
    },
    'Bard': {
        'inventory': [
            {
                'id': 'c_rapier',
                'icon': 'Sword',
                'name': 'Ocelový rapír',
                'slot': 'hlavní ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 2,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +2 (1d8)',
                'sell_price': 15,
                'description': 'Pružná a lehká čepel pro obratné šermíře.'
            },
            {
                'id': 'c_leather',
                'icon': 'Shirt',
                'name': 'Kožená vesta',
                'slot': 'hruď',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 1,
                'healing_amount': 0,
                'stats': 'Obrana: +1 AC',
                'sell_price': 10,
                'description': 'Pohodlná tvrzená kůže neomezující v pohybu.'
            },
            {
                'id': 'c_potion_bard',
                'icon': 'Potion',
                'name': 'Slabý léčivý lektvar',
                'slot': 'žádný',
                'type': 'lektvar',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 25,
                'stats': 'Léčení: +25 HP',
                'sell_price': 10,
                'description': 'Lahvička hojivého nápoje pro případ nouze.'
            }
        ],
        'equipped': {
            'hlava': None,
            'hruď': 'c_leather',
            'hlavní ruka': 'c_rapier',
            'druhá ruka': None,
            'prsten': None,
            'krk': None
        },
        'available_skills': [
            {'id': 'mockery', 'name': 'Jízlivý posměch', 'desc': 'Způsobí psychické zranění a nevýhodu na útok nepřítele (Cantrip).'},
            {'id': 'inspiration', 'name': 'Bardická inspirace', 'desc': 'Zlepší další hod spojence nebo tvůj vlastní (Aktivní).'},
            {'id': 'charm', 'name': 'Kouzlo osobnosti', 'desc': 'Velká výhoda při vyjednávání s NPC (Pasivní).'}
        ],
        'starting_skills': [
            {'id': 'mockery', 'name': 'Jízlivý posměch', 'desc': 'Způsobí psychické zranění a nevýhodu na útok nepřítele (Cantrip).'}
        ]
    },
    'Klerik': {
        'inventory': [
            {
                'id': 'c_mace',
                'icon': 'Sword',
                'name': 'Kovaný palcát',
                'slot': 'hlavní ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 1,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +1 (1d6)',
                'sell_price': 12,
                'description': 'Drtivá zbraň požehnaná kněžským řádem.'
            },
            {
                'id': 'c_shield',
                'icon': 'Shield',
                'name': 'Okovaný štít',
                'slot': 'druhá ruka',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 1,
                'healing_amount': 0,
                'stats': 'Obrana: +1 AC',
                'sell_price': 10,
                'description': 'Dřevěný štít s bronzovým kováním.'
            },
            {
                'id': 'c_chainshirt',
                'icon': 'Shirt',
                'name': 'Kroužková košile',
                'slot': 'hruď',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 2,
                'healing_amount': 0,
                'stats': 'Obrana: +2 AC',
                'sell_price': 20,
                'description': 'Spojované železné kroužky pohlcující sečné rány.'
            },
            {
                'id': 'c_potion_cler',
                'icon': 'Potion',
                'name': 'Slabý léčivý lektvar',
                'slot': 'žádný',
                'type': 'lektvar',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 25,
                'stats': 'Léčení: +25 HP',
                'sell_price': 10,
                'description': 'Lahvička svěcené hojivé vody.'
            }
        ],
        'equipped': {
            'hlava': None,
            'hruď': 'c_chainshirt',
            'hlavní ruka': 'c_mace',
            'druhá ruka': 'c_shield',
            'prsten': None,
            'krk': None
        },
        'available_skills': [
            {'id': 'sacredflame', 'name': 'Posvátný plamen', 'desc': 'Ožehne cíl zářivou svatou energií (Cantrip).'},
            {'id': 'healingword', 'name': 'Léčivé slovo', 'desc': 'Okamžitě obnoví menší množství HP tobě nebo spojenci (Magie).'},
            {'id': 'turnundead', 'name': 'Odvracení nemrtvých', 'desc': 'Zastraší a zažene nemrtvé bytosti (Aktivní).'}
        ],
        'starting_skills': [
            {'id': 'sacredflame', 'name': 'Posvátný plamen', 'desc': 'Ožehne cíl zářivou svatou energií (Cantrip).'}
        ]
    },
    'Druid': {
        'inventory': [
            {
                'id': 'c_staff',
                'icon': 'Wand',
                'name': 'Dubová sukovice',
                'slot': 'hlavní ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 1,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +1 (1d6)',
                'sell_price': 8,
                'description': 'Masivní větev ze starého hvozdu nabitá přírodní silou.'
            },
            {
                'id': 'c_leather_druid',
                'icon': 'Shirt',
                'name': 'Kožená kazajka',
                'slot': 'hruď',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 1,
                'healing_amount': 0,
                'stats': 'Obrana: +1 AC',
                'sell_price': 10,
                'description': 'Oděv z jelení kůže zdobený ptačími pery.'
            },
            {
                'id': 'c_potion_druid',
                'icon': 'Potion',
                'name': 'Slabý léčivý lektvar',
                'slot': 'žádný',
                'type': 'lektvar',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 25,
                'stats': 'Léčení: +25 HP',
                'sell_price': 10,
                'description': 'Mátový výluh s kapkou lesního medu.'
            }
        ],
        'equipped': {
            'hlava': None,
            'hruď': 'c_leather_druid',
            'hlavní ruka': 'c_staff',
            'druhá ruka': None,
            'prsten': None,
            'krk': None
        },
        'available_skills': [
            {'id': 'shillelagh', 'name': 'Šillelagh', 'desc': 'Posílí tvou hůl magií přírody pro mnohem větší poškození (Cantrip).'},
            {'id': 'wildshape', 'name': 'Zvířecí podoba', 'desc': 'Promění tě v šelmu na jeden souboj (Aktivní).'},
            {'id': 'entangle', 'name': 'Propletení', 'desc': 'Ze země vyraší kořeny, které znehybní nepřátele (Magie).'}
        ],
        'starting_skills': [
            {'id': 'shillelagh', 'name': 'Šillelagh', 'desc': 'Posílí tvou hůl magií přírody pro mnohem větší poškození (Cantrip).'}
        ]
    },
    'Bojovník': {
        'inventory': [
            {
                'id': 'c_longsword',
                'icon': 'Sword',
                'name': 'Dlouhý meč',
                'slot': 'hlavní ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 2,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +2 (1d8)',
                'sell_price': 20,
                'description': 'Broušená ocelová čepel s vyváženou záštitou.'
            },
            {
                'id': 'c_shield_f',
                'icon': 'Shield',
                'name': 'Pěchotní štít',
                'slot': 'druhá ruka',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 1,
                'healing_amount': 0,
                'stats': 'Obrana: +1 AC',
                'sell_price': 12,
                'description': 'Masivní štít z tvrdého dřeva vyztužený ocelovým křížem.'
            },
            {
                'id': 'c_chainmail',
                'icon': 'Shirt',
                'name': 'Kroužková zbroj',
                'slot': 'hruď',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 2,
                'healing_amount': 0,
                'stats': 'Obrana: +2 AC',
                'sell_price': 30,
                'description': 'Pevné kroužkové pletivo s koženým podkladem.'
            },
            {
                'id': 'c_potion_fight',
                'icon': 'Potion',
                'name': 'Slabý léčivý lektvar',
                'slot': 'žádný',
                'type': 'lektvar',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 25,
                'stats': 'Léčení: +25 HP',
                'sell_price': 10,
                'description': 'Vojenská přídělová medicína.'
            }
        ],
        'equipped': {
            'hlava': None,
            'hruď': 'c_chainmail',
            'hlavní ruka': 'c_longsword',
            'druhá ruka': 'c_shield_f',
            'prsten': None,
            'krk': None
        },
        'available_skills': [
            {'id': 'secondwind', 'name': 'Druhý dech', 'desc': 'Obnoví ti v boji část zdraví (Aktivní).'},
            {'id': 'actionsurge', 'name': 'Akční vlna', 'desc': 'Umožní ti zaútočit dvakrát v jednom kole (Aktivní).'},
            {'id': 'defense', 'name': 'Mistr obrany', 'desc': 'Vyhnutí se útoku je snadnější (Pasivní).'}
        ],
        'starting_skills': [
            {'id': 'secondwind', 'name': 'Druhý dech', 'desc': 'Obnoví ti v boji část zdraví (Aktivní).'}
        ]
    },
    'Mnich': {
        'inventory': [
            {
                'id': 'c_staff_m',
                'icon': 'Wand',
                'name': 'Bojová hůl bo',
                'slot': 'hlavní ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 1,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +1 (1d6)',
                'sell_price': 8,
                'description': 'Hladká bambusová hůl ideální pro rychlé výpady.'
            },
            {
                'id': 'c_robes_m',
                'icon': 'Shirt',
                'name': 'Klášterní roucho',
                'slot': 'hruď',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Obrana: 0',
                'sell_price': 5,
                'description': 'Volný oděv umožňující akrobatické uhýbání úderům.'
            },
            {
                'id': 'c_potion_monk',
                'icon': 'Potion',
                'name': 'Slabý léčivý lektvar',
                'slot': 'žádný',
                'type': 'lektvar',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 25,
                'stats': 'Léčení: +25 HP',
                'sell_price': 10,
                'description': 'Klášterní hojivý elixír.'
            }
        ],
        'equipped': {
            'hlava': None,
            'hruď': 'c_robes_m',
            'hlavní ruka': 'c_staff_m',
            'druhá ruka': None,
            'prsten': None,
            'krk': None
        },
        'available_skills': [
            {'id': 'flurry', 'name': 'Příval ran', 'desc': 'Série bleskových úderů pěstmi jako extra útok (Aktivní).'},
            {'id': 'patient', 'name': 'Trpělivá obrana', 'desc': 'Soustředíš se výhradně na uhýbání, nepřátelé tě těžko zasáhnou (Aktivní).'},
            {'id': 'deflect', 'name': 'Odražení střel', 'desc': 'Umíš holýma rukama chytat a odrážet letící šípy (Pasivní).'}
        ],
        'starting_skills': [
            {'id': 'flurry', 'name': 'Příval ran', 'desc': 'Série bleskových úderů pěstmi jako extra útok (Aktivní).'}
        ]
    },
    'Paladin': {
        'inventory': [
            {
                'id': 'c_warhammer',
                'icon': 'Sword',
                'name': 'Posvěcené kladivo',
                'slot': 'hlavní ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 2,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +2 (1d8)',
                'sell_price': 20,
                'description': 'Těžké kladivo s vyrytými symboly Řádu.'
            },
            {
                'id': 'c_shield_pal',
                'icon': 'Shield',
                'name': 'Rytířský štít',
                'slot': 'druhá ruka',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 1,
                'healing_amount': 0,
                'stats': 'Obrana: +1 AC',
                'sell_price': 15,
                'description': 'Kovový štít s erbem svatého slunce.'
            },
            {
                'id': 'c_chainmail_pal',
                'icon': 'Shirt',
                'name': 'Těžká kroužková zbroj',
                'slot': 'hruď',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 2,
                'healing_amount': 0,
                'stats': 'Obrana: +2 AC',
                'sell_price': 30,
                'description': 'Dvojitě provázaná ocelová zbroj.'
            },
            {
                'id': 'c_potion_pal',
                'icon': 'Potion',
                'name': 'Slabý léčivý lektvar',
                'slot': 'žádný',
                'type': 'lektvar',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 25,
                'stats': 'Léčení: +25 HP',
                'sell_price': 10,
                'description': 'Svěcený léčivý lektvar.'
            }
        ],
        'equipped': {
            'hlava': None,
            'hruď': 'c_chainmail_pal',
            'hlavní ruka': 'c_warhammer',
            'druhá ruka': 'c_shield_pal',
            'prsten': None,
            'krk': None
        },
        'available_skills': [
            {'id': 'smite', 'name': 'Božský úder', 'desc': 'Tvůj zbraňový útok získá obrovské radiantní (svaté) poškození (Magie).'},
            {'id': 'layonhands', 'name': 'Vkládání rukou', 'desc': 'Léčivý dotyk obnovující větší množství zdraví (Aktivní).'},
            {'id': 'aura', 'name': 'Aura ochrany', 'desc': 'Ty a tvoji spojenci lépe odoláváte magii (Pasivní).'}
        ],
        'starting_skills': [
            {'id': 'smite', 'name': 'Božský úder', 'desc': 'Tvůj zbraňový útok získá obrovské radiantní (svaté) poškození (Magie).'}
        ]
    },
    'Hraničář': {
        'inventory': [
            {
                'id': 'c_longbow',
                'icon': 'Sword',
                'name': 'Jasanový dlouhý luk',
                'slot': 'hlavní ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 2,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +2 (1d8)',
                'sell_price': 25,
                'description': 'Přesný luk s tětivou z koňských žíní.'
            },
            {
                'id': 'c_dagger_r',
                'icon': 'Sword',
                'name': 'Lovecký tesák',
                'slot': 'druhá ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 1,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +1 (1d4)',
                'sell_price': 10,
                'description': 'Záložní zbraň na stahování zvěře a boj zblízka.'
            },
            {
                'id': 'c_leather_r',
                'icon': 'Shirt',
                'name': 'Zesílená kožená zbroj',
                'slot': 'hruď',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 1,
                'healing_amount': 0,
                'stats': 'Obrana: +1 AC',
                'sell_price': 15,
                'description': 'Kvalitní kůže ošetřená proti dešti a větru.'
            },
            {
                'id': 'c_potion_ran',
                'icon': 'Potion',
                'name': 'Slabý léčivý lektvar',
                'slot': 'žádný',
                'type': 'lektvar',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 25,
                'stats': 'Léčení: +25 HP',
                'sell_price': 10,
                'description': 'Bylinný balzám chránící život lovce.'
            }
        ],
        'equipped': {
            'hlava': None,
            'hruď': 'c_leather_r',
            'hlavní ruka': 'c_longbow',
            'druhá ruka': 'c_dagger_r',
            'prsten': None,
            'krk': None
        },
        'available_skills': [
            {'id': 'huntersmark', 'name': 'Značka lovce', 'desc': 'Označí cíl. Útoky proti němu působí bonusové zranění (Magie).'},
            {'id': 'companion', 'name': 'Zvířecí společník', 'desc': 'Povolá na pomoc cvičené zvíře (Aktivní).'},
            {'id': 'survivalist', 'name': 'Přežití v divočině', 'desc': 'Výrazně lepší šance při orientaci, lovu a hledání stop (Pasivní).'}
        ],
        'starting_skills': [
            {'id': 'huntersmark', 'name': 'Značka lovce', 'desc': 'Označí cíl. Útoky proti němu působí bonusové zranění (Magie).'}
        ]
    },
    'Tulák': {
        'inventory': [
            {
                'id': 'c_dagger1',
                'icon': 'Sword',
                'name': 'Černěná dýka',
                'slot': 'hlavní ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 1,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +1 (1d4)',
                'sell_price': 15,
                'description': 'Nelesknoucí se ostří navržené pro rychlé bodnutí ze zálohy.'
            },
            {
                'id': 'c_dagger2',
                'icon': 'Sword',
                'name': 'Párová dýka',
                'slot': 'druhá ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 1,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +1 (1d4)',
                'sell_price': 10,
                'description': 'Vyvážená dýka pro krytí a rychlý protiútok.'
            },
            {
                'id': 'c_leather_t',
                'icon': 'Shirt',
                'name': 'Měkká temná kůže',
                'slot': 'hruď',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 1,
                'healing_amount': 0,
                'stats': 'Obrana: +1 AC',
                'sell_price': 15,
                'description': 'Nevydává žádný zvuk při plížení stíny.'
            },
            {
                'id': 'c_potion_rog',
                'icon': 'Potion',
                'name': 'Slabý léčivý lektvar',
                'slot': 'žádný',
                'type': 'lektvar',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 25,
                'stats': 'Léčení: +25 HP',
                'sell_price': 10,
                'description': 'Záchrana pro každého opatrného zloděje.'
            }
        ],
        'equipped': {
            'hlava': None,
            'hruď': 'c_leather_t',
            'hlavní ruka': 'c_dagger1',
            'druhá ruka': 'c_dagger2',
            'prsten': None,
            'krk': None
        },
        'available_skills': [
            {'id': 'sneakattack', 'name': 'Zákeřný útok', 'desc': 'Pokud nečekaně zaútočíš, způsobíš smrtící bonusové zranění (Pasivní).'},
            {'id': 'cunning', 'name': 'Šikovná akce', 'desc': 'Můžeš uhýbat, schovat se nebo rychle utéct (Aktivní).'},
            {'id': 'lockpicking', 'name': 'Mistr zloděj', 'desc': 'Páčení zámků a vybírání kapes s obrovskou výhodou (Pasivní).'}
        ],
        'starting_skills': [
            {'id': 'sneakattack', 'name': 'Zákeřný útok', 'desc': 'Pokud nečekaně zaútočíš, způsobíš smrtící bonusové zranění (Pasivní).'}
        ]
    },
    'Čaroděj': {
        'inventory': [
            {
                'id': 'c_dagger_sorc',
                'icon': 'Sword',
                'name': 'Obřadní dýka',
                'slot': 'hlavní ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 1,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +1 (1d4)',
                'sell_price': 12,
                'description': 'Čepel rytá runami sloužící k usměrnění vnitřní magie.'
            },
            {
                'id': 'c_robes_sorc',
                'icon': 'Shirt',
                'name': 'Róba z magické látky',
                'slot': 'hruď',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Obrana: 0',
                'sell_price': 10,
                'description': 'Jemný plášť utkaný s příměsí éterických nití.'
            },
            {
                'id': 'c_potion_sorc',
                'icon': 'Potion',
                'name': 'Slabý léčivý lektvar',
                'slot': 'žádný',
                'type': 'lektvar',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 25,
                'stats': 'Léčení: +25 HP',
                'sell_price': 10,
                'description': 'Klasická hojivá směs.'
            }
        ],
        'equipped': {
            'hlava': None,
            'hruď': 'c_robes_sorc',
            'hlavní ruka': 'c_dagger_sorc',
            'druhá ruka': None,
            'prsten': None,
            'krk': None
        },
        'available_skills': [
            {'id': 'firebolt', 'name': 'Ohnivá střela', 'desc': 'Vyšle mocný ohnivý projektil (Cantrip).'},
            {'id': 'quicken', 'name': 'Zrychlené kouzlo', 'desc': 'Umožní ti zakouzlit velmi rychle (Aktivní).'},
            {'id': 'shield', 'name': 'Magický štít', 'desc': 'Jako reakci vytvoříš bariéru odrážející útoky (Magie).'}
        ],
        'starting_skills': [
            {'id': 'firebolt', 'name': 'Ohnivá střela', 'desc': 'Vyšle mocný ohnivý projektil (Cantrip).'}
        ]
    },
    'Černokněžník': {
        'inventory': [
            {
                'id': 'c_dagger_warlock',
                'icon': 'Sword',
                'name': 'Rituální dýka Paktu',
                'slot': 'hlavní ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 1,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +1 (1d4)',
                'sell_price': 15,
                'description': 'Zbraň spojená s tvým nadpřirozeným patronem.'
            },
            {
                'id': 'c_robes_warlock',
                'icon': 'Shirt',
                'name': 'Stínový oděv',
                'slot': 'hruď',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Obrana: 0',
                'sell_price': 10,
                'description': 'Plášť pohlcující světlo svící.'
            },
            {
                'id': 'c_potion_warlock',
                'icon': 'Potion',
                'name': 'Slabý léčivý lektvar',
                'slot': 'žádný',
                'type': 'lektvar',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 25,
                'stats': 'Léčení: +25 HP',
                'sell_price': 10,
                'description': 'Léčivý nápoj pro případ nouze.'
            }
        ],
        'equipped': {
            'hlava': None,
            'hruď': 'c_robes_warlock',
            'hlavní ruka': 'c_dagger_warlock',
            'druhá ruka': None,
            'prsten': None,
            'krk': None
        },
        'available_skills': [
            {'id': 'eldritchblast', 'name': 'Mrazivý paprsek', 'desc': 'Ikonický útok praskající temnou energií (Cantrip).'},
            {'id': 'hellish', 'name': 'Pekelná odplata', 'desc': 'Pokud jsi zraněn, útočník vzplane (Magie).'},
            {'id': 'darkvision', 'name': 'Ďáblovo vidění', 'desc': 'Perfektní vidění ve tmě a magické temnotě (Pasivní).'}
        ],
        'starting_skills': [
            {'id': 'eldritchblast', 'name': 'Mrazivý paprsek', 'desc': 'Ikonický útok praskající temnou energií (Cantrip).'}
        ]
    },
    'Kouzelník': {
        'inventory': [
            {
                'id': 'c_wand_wiz',
                'icon': 'Wand',
                'name': 'Učňovská hůlka',
                'slot': 'hlavní ruka',
                'type': 'zbraň',
                'rarity': 'common',
                'attack_bonus': 1,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Útok: +1 (1d4)',
                'sell_price': 20,
                'description': 'Vyřezávaná hůlka z tisového dřeva pro sesílání kouzel.'
            },
            {
                'id': 'c_robes_wiz',
                'icon': 'Shirt',
                'name': 'Učenecká róba',
                'slot': 'hruď',
                'type': 'zbroj',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 0,
                'stats': 'Obrana: 0',
                'sell_price': 10,
                'description': 'Pohodlný oděv s mnoha kapsami na svitky a reagencie.'
            },
            {
                'id': 'c_potion_wiz',
                'icon': 'Potion',
                'name': 'Slabý léčivý lektvar',
                'slot': 'žádný',
                'type': 'lektvar',
                'rarity': 'common',
                'attack_bonus': 0,
                'defense_bonus': 0,
                'healing_amount': 25,
                'stats': 'Léčení: +25 HP',
                'sell_price': 10,
                'description': 'Standardní alchymistický lektvar zdraví.'
            }
        ],
        'equipped': {
            'hlava': None,
            'hruď': 'c_robes_wiz',
            'hlavní ruka': 'c_wand_wiz',
            'druhá ruka': None,
            'prsten': None,
            'krk': None
        },
        'available_skills': [
            {'id': 'rayoffrost', 'name': 'Mrazivý dotek', 'desc': 'Vrhne ledový paprsek, který zpomalí cíl (Cantrip).'},
            {'id': 'magicmissile', 'name': 'Magická střela', 'desc': 'Tři magické šipky, které vždy neomylně zasáhnou cíl (Magie).'},
            {'id': 'magearmor', 'name': 'Mágova zbroj', 'desc': 'Magicky zvýší tvou obranu (Magie).'}
        ],
        'starting_skills': [
            {'id': 'rayoffrost', 'name': 'Mrazivý dotek', 'desc': 'Vrhne ledový paprsek, který zpomalí cíl (Cantrip).'}
        ]
    }
}

def hex_distance(q1, r1, q2, r2):
    return (abs(q1 - q2) + abs(q1 + r1 - q2 - r2) + abs(r1 - r2)) // 2

import unicodedata
import re
import hashlib

def normalize_quest_title(title: str) -> str:
    if not title:
        return ""
    norm = unicodedata.normalize('NFKD', str(title)).encode('ascii', 'ignore').decode('ascii').lower()
    return re.sub(r'[^a-z0-9]+', '', norm).strip()

def sanitize_and_deduplicate_quests(quests: list) -> list:
    if not isinstance(quests, list):
        return []
    cleaned_quests = []
    seen_map = {}

    for q in quests:
        if not isinstance(q, dict):
            continue
        nazev = str(q.get('nazev', '')).strip()
        if not nazev:
            continue
        
        norm_key = normalize_quest_title(nazev)
        if not norm_key:
            continue

        q_id = q.get('id')
        hash_id = hashlib.md5(norm_key.encode('utf-8')).hexdigest()[:10]
        deterministic_id = f"quest_{hash_id}"
        final_id = q_id if (q_id and not q_id.startswith('quest_') and len(q_id) < 40) else deterministic_id

        stav_raw = str(q.get('stav', 'aktivni')).strip().lower()
        if 'spln' in stav_raw:
            stav = 'splněno'
        elif 'selh' in stav_raw:
            stav = 'selhání'
        else:
            stav = 'aktivni'

        popis = str(q.get('popis', '')).strip()

        if norm_key in seen_map:
            idx = seen_map[norm_key]
            existing = cleaned_quests[idx]
            if stav == 'splněno' or existing.get('stav') == 'splněno':
                existing['stav'] = 'splněno'
            elif stav == 'selhání' or existing.get('stav') == 'selhání':
                existing['stav'] = 'selhání'
            
            if len(popis) > len(existing.get('popis', '')):
                existing['popis'] = popis
            if len(nazev) > len(existing.get('nazev', '')):
                existing['nazev'] = nazev
        else:
            seen_map[norm_key] = len(cleaned_quests)
            cleaned_quests.append({
                'id': final_id,
                'nazev': nazev,
                'popis': popis,
                'stav': stav
            })

    return cleaned_quests

