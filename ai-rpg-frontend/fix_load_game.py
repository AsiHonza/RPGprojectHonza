import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

old_state_load = """        const state = data.character.state || {};
        setHp(state.hp || 100);
        if (state.gold !== undefined) setGold(state.gold);
        if (state.currentSpellSlots !== undefined) setCurrentSpellSlots(state.currentSpellSlots);
        if (state.maxSpellSlots !== undefined) setMaxSpellSlots(state.maxSpellSlots);
        setInventory(state.inventory || []);
        setEquipped(state.equipped || {
          "hlava": null,
          "hruď": null,
          "hlavní ruka": null,
          "druhá ruka": null,
          "prsten": null,
          "krk": null
        });"""

new_state_load = """        const state = data.character.state || {};
        setHp(state.hp || 100);
        if (state.gold !== undefined) setGold(state.gold);
        if (state.currentSpellSlots !== undefined) setCurrentSpellSlots(state.currentSpellSlots);
        if (state.maxSpellSlots !== undefined) setMaxSpellSlots(state.maxSpellSlots);
        setInventory(state.inventory || []);
        setEquipped(state.equipped || {
          "hlava": null,
          "hruď": null,
          "hlavní ruka": null,
          "druhá ruka": null,
          "prsten": null,
          "krk": null
        });
        setLevel(state.level || 1);
        setXp(state.xp || 0);
        setSkillPoints(state.skillPoints || 0);
        setSkills(state.skills || []);
        setInCombat(state.inCombat || false);
        setEnemies(state.enemies || []);
        setQuests(state.quests || []);
        if (state.stats) setStats(state.stats);
        if (state.locationType) setLocationType(state.locationType);
        if (state.currentRegion) setCurrentRegion(state.currentRegion);
        if (state.pointsOfInterest) setPointsOfInterest(state.pointsOfInterest);
"""

# The strings might have encoding issues with "hruď" in powershell vs "hru" in file
# Let's replace just around `setInventory(state.inventory || []);`
# Wait, I'll use regex.
import re
new_additional = """
        setLevel(state.level || 1);
        setXp(state.xp || 0);
        setSkillPoints(state.skillPoints || 0);
        setSkills(state.skills || []);
        setInCombat(state.inCombat || false);
        setEnemies(state.enemies || []);
        setQuests(state.quests || []);
        if (state.stats) setStats(state.stats);
        if (state.locationType) setLocationType(state.locationType);
        if (state.currentRegion) setCurrentRegion(state.currentRegion);
        if (state.pointsOfInterest) setPointsOfInterest(state.pointsOfInterest);
"""

content = content.replace('setGameState("playing");', new_additional + '\n        setGameState("playing");')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("loadGame state restored!")
