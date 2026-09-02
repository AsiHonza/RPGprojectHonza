import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start_idx = -1
end_idx = -1

for i, l in enumerate(lines):
    if 'const startNewGame = async () => {' in l:
        start_idx = i
        break

for i in range(start_idx, len(lines)):
    if 'setLoading(false);' in lines[i] and '}' in lines[i+1]:
        end_idx = i + 1
        break

new_func = """  const startNewGame = async () => {
    if (!name) return alert("Zadejte jméno!");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/create-character`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dnd_class: dndClass, race, stats, email: email, api_key: "DUMMY", game_mode: gameMode }),
      });
      const data = await res.json();
      
      if (res.ok) {
        // Load the character to fetch full state including generated world_data
        await loadGame(name);
        
        // Ensure UI updates properly to playing state
        setGameState("playing");
      } else {
        alert(data.detail || "Chyba při tvorbě.");
      }
    } catch (e) {
      alert("Nelze se připojit k serveru.");
    }
    setLoading(false);
  };
"""

if start_idx != -1 and end_idx != -1:
    lines = lines[:start_idx] + [new_func] + lines[end_idx+1:]
    with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
        f.write("".join(lines))
