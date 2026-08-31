import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

bad_chunk = """
        setLevel(state.level || 1);
        setXp(state.xp || 0);
        setSkillPoints(state.skillPoints || 0);
        setSkills(state.skills || []);
        setInCombat(state.inCombat || false);
        setEnemies(state.enemies || []);
        setQuests(state.quests || []);
        if (data.character.stats) setStats(data.character.stats);
        if (state.locationType) setLocationType(state.locationType);
        if (state.currentRegion) setCurrentRegion(state.currentRegion);
        if (state.pointsOfInterest) setPointsOfInterest(state.pointsOfInterest);

        setGameState("playing");"""

# find all occurrences of bad_chunk
parts = content.split(bad_chunk)
if len(parts) > 2:
    # First one is loadGame, second is createCharacter
    content = parts[0] + bad_chunk + parts[1] + '\n        setGameState("playing");\n' + parts[2]

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("createCharacter state restored.")
