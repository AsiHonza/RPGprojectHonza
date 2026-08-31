import codecs

with codecs.open('src/app/page.tsx', 'r', 'utf-8') as f:
    content = f.read()

# 1. Add state variable
state_marker = 'const [history, setHistory] = useState<any[]>([]);'
state_insertion = 'const [savedCharacters, setSavedCharacters] = useState<any[]>([]);\n  '
content = content.replace(state_marker, state_insertion + state_marker)

loadGame_marker = '  const loadGame = async () => {'
listChars_func = '''
  const fetchCharacters = async () => {
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
      });'''

old_loadGame_block = '''  const loadGame = async () => {
    if (!apiKey) return alert("Zadejte API klíč pro načtení pozice!");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/load-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey.trim() }),
      });'''

content = content.replace(old_loadGame_block, listChars_func)

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write(content)
print("Frontend updated - Part 1.")
