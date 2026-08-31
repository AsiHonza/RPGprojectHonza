import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    lines = f.readlines()

new_code = """  const fetchCharacters = async () => {
    if (!apiKey) return alert("Zadejte API klíč!");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/list-characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSavedCharacters(data.characters || []);
      } else {
        alert(data.detail || "Chyba při načítání postav.");
      }
    } catch (e) {
      alert("Chyba připojení k serveru.");
    }
    setLoading(false);
  };

  const loadGame = async (characterName: string) => {
    if (!apiKey || !characterName) return alert("Zadejte API klíč a jméno!");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/load-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey.trim(), name: characterName }),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("aethelgard_api_key", apiKey.trim());
        setName(data.character.name);
        setRace(data.character.race);
        setDndClass(data.character.dnd_class);
        
        let lastSuggestedActions: string[] = [];
        let lastImage = null;
        let lastDesc = "";
        
        const loadedHistory = data.character.history.map((msg: any) => {
          if (msg.role === "user") {
            return { type: "player", text: msg.text };
          }
          if (msg.role === "model") {
            try {
              const dm_data = JSON.parse(msg.text);
              if (dm_data.nabizene_akce) lastSuggestedActions = dm_data.nabizene_akce;
              if (dm_data.image_prompt) lastImage = dm_data.image_prompt;
              if (dm_data.popis_okoli) lastDesc = dm_data.popis_okoli;
              
              return {
                type: "dm",
                popis_okoli: dm_data.popis_okoli,
                image_prompt: dm_data.image_prompt,
                vypravec: dm_data.vypravec,
                system_log: dm_data.system_log,
                npc_dialogy: dm_data.npc_dialogy,
                v_boji: dm_data.v_boji,
                nepratele: dm_data.nepratele,
                typ_lokace: dm_data.typ_lokace,
                aktualni_region: dm_data.aktualni_region,
                vyznamna_mista: dm_data.vyznamna_mista
              };
            } catch (e) {
              return { type: "error", text: "Chybný formát zprávy z historie." };
            }
          }
          return null;
        }).filter(Boolean);
        
        setHistory(loadedHistory);
        setSuggestedActions(lastSuggestedActions);
        
        const state = data.character.state || {};
        setHp(state.hp || 100);
        setInventory(state.inventory || []);
        setEquipped(state.equipped || {
          "hlava": null,
          "hruď": null,
          "hlavní ruka": null,
          "druhá ruka": null,
          "prsten": null,
          "krk": null
        });
        
        setGameState("playing");
        
        if (lastDesc) {
            playAudioSequentially([{text: lastDesc, type: "narrator"}]);
        }
      } else {
        alert(data.detail || "Chyba při načítání pozice.");
      }
    } catch (err) {
      alert("Chyba připojení k serveru.");
    }
    setLoading(false);
  };
"""

new_lines = lines[:229] + [new_code] + lines[311:]

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.writelines(new_lines)
print("Updated loadGame and fetchCharacters!")
