def get_action_intent(action_str: str, api_key: str = None) -> str:
    """Deterministic intent router — classifies player input as UI_AKCE or BEZNA_HRA.
    
    Replaces the previous Gemini API call with expanded keyword matching.
    Saves ~160 tokens per turn and ~300-500ms latency.
    """
    if not action_str or action_str.strip() == "":
        return 'BEZNA_HRA'
    
    clean = action_str.lower().strip()
    
    # Exact-match UI keywords (common short commands)
    ui_exact = {
        "inventar", "inventář", "batoh", "denik", "deník",
        "ukoly", "úkoly", "staty", "statistiky", "stats",
        "mapa", "menu", "nastaveni", "nastavení", "quest",
        "questy", "schopnosti", "equipment", "vybaveni",
        "vybavení", "journal", "log", "záznamy", "zaznamy"
    }
    
    if clean in ui_exact:
        return 'UI_AKCE'
    
    # Prefix-based UI patterns
    ui_prefixes = [
        "ukaž ", "ukaz ", "otevři inventář", "otevri inventar",
        "podívej se na ", "podivej se na ", "zobraz ",
        "co mám v", "co mam v", "koukni na ", "otevři deník",
        "otevri denik", "ukaž úkoly", "ukaz ukoly",
        "podívej do ", "podivej do ", "otevři mapu",
        "otevri mapu", "ukaž staty", "ukaz staty",
        "koukni do ", "zkontroluj "
    ]
    
    if any(clean.startswith(p) for p in ui_prefixes):
        # Safety check: if it also contains a story action, treat as gameplay
        story_indicators = [
            " a ", " pak ", " potom ", "zabij", "jdi", "otevři dveře",
            "útok", "utok", "mluv", "prozkoumej", "bojuj", "zaútoč",
            "zautoc", "seber", "použij", "pouzij", "vystřel", "vystrel",
            "kouzl", "uteč", "utec", "skryj", "vyjednávej", "vyjednavej"
        ]
        if not any(w in clean for w in story_indicators):
            return 'UI_AKCE'
    
    # Question-form UI queries
    ui_questions = [
        "co mám v batohu", "co mam v batohu",
        "jaké mám úkoly", "jake mam ukoly",
        "jaké mám staty", "jake mam staty",
        "kolik mám zlata", "kolik mam zlata",
        "kolik mám životů", "kolik mam zivotu",
        "kolik mám hp", "kolik mam hp",
        "jakou mám zbraň", "jakou mam zbran",
        "co mám na sobě", "co mam na sobe"
    ]
    
    if any(clean.startswith(q) for q in ui_questions):
        story_indicators = [" a ", " pak ", " potom "]
        if not any(w in clean for w in story_indicators):
            return 'UI_AKCE'
    
    return 'BEZNA_HRA'
