import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

travel_func = """
  const handleTravel = async (q: number, r: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/travel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          name: name,
          target_q: q,
          target_r: r
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        setPlayerLocation(data.state.playerLocation);
        setDay(data.state.day);
        setRations(data.state.rations);
        setHp(data.state.hp);
        
        // Push the narrative text to history directly so the player sees it
        setHistory(prev => [...prev, { type: "system", text: data.narrative }]);
        
        // Generate TTS for narrative
        playVoice(data.narrative, "vypravec");
        
        // Close map
        setMapOpen(false);
      } else {
        alert("Chyba při cestování: " + data.detail);
      }
    } catch (e) {
      console.error(e);
      alert("Chyba spojení.");
    } finally {
      setLoading(false);
    }
  };
"""

for i, l in enumerate(lines):
    if "const sendAction = async (actionText: string) => {" in l:
        lines.insert(i, travel_func)
        break

for i, l in enumerate(lines):
    if "<MapModal isOpen={mapOpen}" in l:
        lines[i] = lines[i].replace("setSelectedItem={setSelectedItem} />", "setSelectedItem={setSelectedItem} onTravel={handleTravel} />")
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
