from app.services.quest_engine import is_same_quest_fuzzy, process_quests_lifecycle, merge_quest_update

def test_jeremias_duplicate_matching():
    q1 = {"nazev": "Ukradený amulet", "popis": "Pomoz kupci Jeremiášovi získat zpět jeho rodinný amulet od pašeráka Kaela."}
    q2 = {"nazev": "Ukradený rodinný amulet", "popis": "Navrátil jsi kupci Jeremiášovi jeho ukradený amulet od pašeráka Kaela."}
    q3 = {"nazev": "Ukradený amulet kupce Jeremiáše", "popis": "Pomohl jsi kupci Jeremiášovi získat zpět světélkující rodinný amulet od pašeráka Kaela."}
    q4 = {"nazev": "Amulet kupce Jeremiáše", "popis": "Získat zpět ukradený rodinný amulet od pašeráka Kaela."}

    assert is_same_quest_fuzzy(q1, q2), "q1 and q2 must match!"
    assert is_same_quest_fuzzy(q1, q3), "q1 and q3 must match!"
    assert is_same_quest_fuzzy(q1, q4), "q1 and q4 must match!"
    assert is_same_quest_fuzzy(q3, q4), "q3 and q4 must match!"
    print("[OK] All Jeremias quest permutations matched successfully!")

def test_quest_lifecycle_deduplication():
    initial_quests = []
    
    # 1. Player accepts quest
    inc1 = [{"nazev": "Ukradený amulet", "popis": "Pomoz kupci Jeremiášovi najít amulet", "zadavatel": "Kupec Jeremiáš"}]
    updated, logs = process_quests_lifecycle(inc1, initial_quests, "Ano, pomohu ti najít amulet", [])
    assert len(updated) == 1, f"Expected 1 quest, got {len(updated)}"
    assert updated[0]['stav'] == 'aktivni'
    print("[OK] Step 1: Quest created cleanly:", updated[0]['nazev'], updated[0]['id'])
    
    # 2. Player talks to someone, AI hallucinated a slightly different quest name
    inc2 = [{"nazev": "Ukradený rodinný amulet", "popis": "Kael má amulet v docích", "zadavatel": "Kupec Jeremiáš"}]
    updated2, logs2 = process_quests_lifecycle(inc2, updated, "Hledám Kaela", [])
    assert len(updated2) == 1, f"Expected STILL 1 quest, got {len(updated2)}"
    print("[OK] Step 2: Quest updated without duplicate:", updated2[0]['nazev'])

    # 3. Player gets the amulet in inventory
    inv = [{"id": "item_amulet", "name": "Rodinný amulet", "type": "cennost"}]
    updated3, logs3 = process_quests_lifecycle([], updated2, "Prohledávám truhlu", inv)
    assert len(updated3) == 1
    # Check that the step was auto-completed
    assert any(k.get('splneno') for k in updated3[0].get('kroky', [])), "Step should be marked done!"
    print("[OK] Step 3: Inventory reconciler automatically marked quest objective complete!")

    # 4. Player returns amulet, AI sends past tense completion
    inc4 = [{"nazev": "Amulet kupce Jeremiáše", "popis": "Navrátil jsi amulet Jeremiášovi", "stav": "splněno"}]
    updated4, logs4 = process_quests_lifecycle(inc4, updated3, "Zde máš svůj amulet", [])
    assert len(updated4) == 1, f"Expected STILL 1 quest, got {len(updated4)}"
    assert updated4[0]['stav'] == 'splněno', f"Expected splněno, got {updated4[0]['stav']}"
    print("[OK] Step 4: Quest marked completed cleanly without creating duplicates!")

if __name__ == "__main__":
    test_jeremias_duplicate_matching()
    test_quest_lifecycle_deduplication()
    print("\nALL BACKEND QUEST ENGINE TESTS PASSED!")
