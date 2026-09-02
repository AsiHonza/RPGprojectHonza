import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Instead of manually setting states in startNewGame, if it succeeds, let's call loadGame()!
# Wait, loadGame() requires `email` and `name` which are already in state.
new_start = """
      try {
        const res = await fetch(`${API_URL}/create-character`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, dnd_class: dndClass, race, stats, email: email, api_key: "DUMMY", game_mode: gameMode }),
        });
        const data = await res.json();
        
        if (res.ok) {
          setHistory([
            { type: "system", text: data.message },
            { type: "dm", popis_okoli: data.popis_okoli, vypravec: data.intro_text }
          ]);
          setSuggestedActions(["Rozhlédnout se", "Zkontrolovat vybavení", "Vydat se vpřed"]);
          setCurrentLocationDesc(data.popis_okoli || "Neznámé místo.");
          setCurrentRegion("Začátek cesty");

          // Load the character to fetch full state including generated world_data
          await loadGame(name, email);
          
          setGameState("playing");
        } else {
          alert(data.detail || "Chyba při tvorbě.");
          setGameState("menu");
        }
      } catch (e) {
        alert("Nelze se připojit k serveru.");
        setGameState("menu");
      }
      setLoading(false);
"""

# Let's find the current try-catch block in startNewGame and replace it.
import re
content = re.sub(r'try \{\s+const res = await fetch\(`\$\{API_URL\}/create-character`.*?setLoading\(false\);', new_start, content, flags=re.DOTALL)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("startNewGame loadGame fixed.")
